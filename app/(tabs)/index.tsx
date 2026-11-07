import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BeninMap } from "@/components/benin-map";
import { haptic } from "@/lib/haptics";
import {
  getStatusLabel,
  STATUS_COLORS,
  type Station,
  type StationStatus,
} from "@/lib/stations";
import { useStations } from "@/lib/stations-context";

type Filter = "all" | StationStatus;
type OperatorFilter = "all" | string;

function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const radius = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const value = Math.sin(dLat / 2) ** 2 + Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function StatusBadge({ status, compact = false }: { status: StationStatus; compact?: boolean }) {
  return (
    <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[status]}18` }, compact && styles.statusBadgeCompact]}>
      <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[status] }]} />
      <Text style={[styles.statusText, { color: STATUS_COLORS[status] }, compact && styles.statusTextCompact]}>
        {getStatusLabel(status)}
      </Text>
    </View>
  );
}

function MapPreview({ stations, onSelect }: { stations: Station[]; onSelect: (station: Station) => void }) {
  return (
    <View style={styles.mapCard}>
      <View style={styles.mapHeader}>
        <View>
          <Text style={styles.mapTitle}>Carte du Bénin</Text>
          <Text style={styles.mapSubtitle}>Stations recensées · mise à jour terrain</Text>
        </View>
        <View style={styles.mapCount}>
          <Text style={styles.mapCountValue}>{stations.length}</Text>
          <Text style={styles.mapCountLabel}>stations</Text>
        </View>
      </View>
      <BeninMap stations={stations} onSelect={onSelect} />
      <Text style={styles.mapFootnote}>Carte OpenStreetMap · zoomez et appuyez sur un marqueur pour voir la station</Text>
    </View>
  );
}

function StationCard({ station, onPress }: { station: Station; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.stationCard, pressed && styles.pressed]}>
      <View style={styles.stationIcon}>
        <IconSymbol name="fuelpump.fill" size={20} color="#0B6B5A" />
      </View>
      <View style={styles.stationMain}>
        <View style={styles.stationTitleRow}>
          <Text style={styles.stationName} numberOfLines={1}>{station.name}</Text>
          <IconSymbol name="chevron.right" size={18} color="#99A8A0" />
        </View>
        <Text style={styles.stationAddress} numberOfLines={1}>{station.city} · {station.district} · {station.operator}</Text>
        <View style={styles.stationMetaRow}>
          <StatusBadge status={station.status} compact />
          <Text style={styles.updatedText}>{station.statusUpdatedAt}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { stations, updateStatus } = useStations();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [operator, setOperator] = useState<OperatorFilter>("all");
  const [city, setCity] = useState("Toutes les villes");
  const [nearbyOnly, setNearbyOnly] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [selected, setSelected] = useState<Station | null>(null);
  const [routeOrigin, setRouteOrigin] = useState("");

  useEffect(() => {
    if (!nearbyOnly || typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { setLocation({ latitude: coords.latitude, longitude: coords.longitude }); setLocationMessage(""); },
      () => { setLocationMessage("Autorisez la localisation pour voir les stations à proximité."); setNearbyOnly(false); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  }, [nearbyOnly]);

  const operators = useMemo(() => ["all", ...Array.from(new Set(stations.map((station) => station.operator))).sort()], [stations]);
  const cities = useMemo(() => ["Toutes les villes", ...Array.from(new Set(stations.map((station) => station.city))).sort()], [stations]);

  const counts = useMemo(() => ({
    all: stations.length,
    available: stations.filter((station) => station.status === "available").length,
    out: stations.filter((station) => station.status === "out").length,
    unknown: stations.filter((station) => station.status === "unknown").length,
  }), [stations]);

  const filteredStations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return stations.filter((station) => {
      const matchesFilter = filter === "all" || station.status === filter;
      const matchesOperator = operator === "all" || station.operator === operator;
      const matchesCity = city === "Toutes les villes" || station.city === city;
      const matchesNearby = !nearbyOnly || !location || distanceKm(location.latitude, location.longitude, station.latitude, station.longitude) <= 10;
      const matchesQuery = !normalized || [station.name, station.city, station.district, station.operator]
        .join(" ")
        .toLowerCase()
        .includes(normalized);
      return matchesFilter && matchesOperator && matchesCity && matchesNearby && matchesQuery;
    });
  }, [city, filter, location, nearbyOnly, operator, query, stations]);

  const reportFromDetail = (status: StationStatus) => {
    if (!selected) return;
    updateStatus(selected.id, status);
    haptic.success();
    Alert.alert("Merci pour le signalement", `${selected.name} est maintenant marqué « ${getStatusLabel(status)} » sur cet appareil.`);
    setSelected(null);
  };

  const openRoute = (origin?: string) => {
    if (!selected) return;
    const destination = `${selected.latitude},${selected.longitude}`;
    const encodedOrigin = origin?.trim() ? encodeURIComponent(origin.trim()) : "";
    const url = encodedOrigin
      ? `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${destination}&travelmode=driving`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;
    void Linking.openURL(url);
  };

  const openRouteFromCurrentLocation = () => {
    if (!selected) return;
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      openRoute();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => openRoute(`${coords.latitude},${coords.longitude}`),
      () => { Alert.alert("Localisation indisponible", "La carte va s’ouvrir avec la station comme destination. Vous pourrez choisir votre point de départ dans Google Maps."); openRoute(); },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <StationCard station={item} onPress={() => setSelected(item)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.topBar}>
              <View style={styles.brandMark}><Image source={require("@/assets/images/logo_essence_benin.png")} style={styles.brandLogo} /></View>
              <View style={styles.brandCopy}>
                <Text style={styles.eyebrow}>BÉNIN · MOBILITÉ</Text>
                <Text style={styles.brandTitle}>Essence Bénin</Text>
              </View>
              <View style={styles.liveChip}><View style={styles.liveDot} /><Text style={styles.liveText}>Terrain</Text></View>
            </View>

            <View style={styles.heroBlock}>
              <Text style={styles.heroTitle}>Trouvez de l’essence,{"\n"}pas une station au hasard.</Text>
              <Text style={styles.heroSubtitle}>Les derniers signalements des conducteurs, réunis au même endroit.</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}><Text style={styles.statValue}>{counts.all}</Text><Text style={styles.statLabel}>recensées</Text></View>
              <View style={[styles.statCard, styles.statCardGreen]}><Text style={[styles.statValue, { color: STATUS_COLORS.available }]}>{counts.available}</Text><Text style={styles.statLabel}>disponibles</Text></View>
              <View style={[styles.statCard, styles.statCardGold]}><Text style={[styles.statValue, { color: STATUS_COLORS.unknown }]}>{counts.unknown + counts.out}</Text><Text style={styles.statLabel}>à vérifier</Text></View>
            </View>

            <View style={styles.searchBox}>
              <IconSymbol name="magnifyingglass" size={20} color="#7A8A82" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher une ville, un quartier…"
                placeholderTextColor="#98A69F"
                style={styles.searchInput}
                returnKeyType="search"
              />
              <Pressable onPress={() => setQuery("")} style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}>
                <IconSymbol name="line.3.horizontal.decrease.circle" size={20} color="#0B6B5A" />
              </Pressable>
            </View>

            <View style={styles.filterRow}>
              {(["all", "available", "out", "unknown"] as Filter[]).map((item) => {
                const active = filter === item;
                const label = item === "all" ? "Toutes" : item === "available" ? "Essence" : item === "out" ? "Rupture" : "À vérifier";
                return (
                  <Pressable key={item} onPress={() => { haptic.light(); setFilter(item); }} style={({ pressed }) => [styles.filterPill, active && styles.filterPillActive, pressed && styles.pressed]}>
                    <Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text>
                    <Text style={[styles.filterCount, active && styles.filterCountActive]}>{counts[item]}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Opérateur</Text>
              <FlatList horizontal showsHorizontalScrollIndicator={false} data={operators} keyExtractor={(item) => item} contentContainerStyle={styles.horizontalFilters} renderItem={({ item }) => {
                const active = operator === item;
                return <Pressable onPress={() => setOperator(item)} style={({ pressed }) => [styles.secondaryPill, active && styles.secondaryPillActive, pressed && styles.pressed]}><Text style={[styles.secondaryPillText, active && styles.secondaryPillTextActive]}>{item === "all" ? "Tous" : item}</Text></Pressable>;
              }} />
              <Text style={styles.filterSectionTitle}>Ville</Text>
              <FlatList horizontal showsHorizontalScrollIndicator={false} data={cities} keyExtractor={(item) => item} contentContainerStyle={styles.horizontalFilters} renderItem={({ item }) => {
                const active = city === item;
                return <Pressable onPress={() => setCity(item)} style={({ pressed }) => [styles.secondaryPill, active && styles.secondaryPillActive, pressed && styles.pressed]}><Text style={[styles.secondaryPillText, active && styles.secondaryPillTextActive]}>{item}</Text></Pressable>;
              }} />
              <Pressable onPress={() => setNearbyOnly((current) => !current)} style={({ pressed }) => [styles.nearbyButton, nearbyOnly && styles.nearbyButtonActive, pressed && styles.pressed]}>
                <IconSymbol name="location.fill" size={16} color={nearbyOnly ? "#FFFFFF" : "#0B6B5A"} />
                <Text style={[styles.nearbyText, nearbyOnly && styles.nearbyTextActive]}>Essence à proximité (10 km)</Text>
              </Pressable>
              {locationMessage ? <Text style={styles.locationMessage}>{locationMessage}</Text> : null}
            </View>

            <MapPreview stations={stations} onSelect={setSelected} />
            <View style={styles.sectionHeading}>
              <View><Text style={styles.sectionTitle}>{filter === "all" ? "Toutes les stations" : filter === "available" ? "Essence disponible" : filter === "out" ? "Ruptures signalées" : "Stations à vérifier"}</Text><Text style={styles.sectionSubtitle}>{filteredStations.length} résultat{filteredStations.length > 1 ? "s" : ""}</Text></View>
              <Text style={styles.sortLabel}>RÉCENTES</Text>
            </View>
          </View>
        }
        ListEmptyComponent={<View style={styles.emptyState}><IconSymbol name="magnifyingglass" size={28} color="#8BA197" /><Text style={styles.emptyTitle}>Aucune station trouvée</Text><Text style={styles.emptyText}>Essayez une autre ville ou retirez le filtre.</Text></View>}
      />

      <Modal visible={Boolean(selected)} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.sheet} onPress={() => undefined}>
            <View style={styles.sheetHandle} />
            {selected && (
              <>
                <View style={styles.sheetHeader}>
                  <View style={styles.sheetIcon}><IconSymbol name="fuelpump.fill" size={24} color="#0B6B5A" /></View>
                  <View style={styles.sheetTitleBlock}><Text style={styles.sheetTitle}>{selected.name}</Text><Text style={styles.sheetSubtitle}>{selected.city} · {selected.district}</Text></View>
                  <Pressable onPress={() => setSelected(null)} style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}><Text style={styles.closeText}>×</Text></Pressable>
                </View>
                <StatusBadge status={selected.status} />
                <View style={styles.detailLine}><IconSymbol name="location.fill" size={17} color="#7D8D85" /><Text style={styles.detailText}>{selected.address}</Text></View>
                <View style={styles.detailLine}><IconSymbol name="location.fill" size={17} color="#7D8D85" /><Text style={styles.detailText}>{selected.operator} · {selected.city} · GPS {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}</Text></View>
                <View style={styles.detailLine}><IconSymbol name="arrow.clockwise" size={17} color="#7D8D85" /><Text style={styles.detailText}>Dernier statut : {selected.statusUpdatedAt} · {selected.source}</Text></View>
                <Text style={styles.routeTitle}>Itinéraire vers cette station</Text>
                <TextInput value={routeOrigin} onChangeText={setRouteOrigin} placeholder="Point de départ (ville ou adresse, facultatif)" placeholderTextColor="#98A69F" style={styles.routeInput} />
                <View style={styles.routeActions}>
                  <Pressable onPress={openRouteFromCurrentLocation} style={({ pressed }) => [styles.routeButton, styles.routeButtonPrimary, pressed && styles.pressed]}><IconSymbol name="location.fill" size={16} color="#FFFFFF" /><Text style={styles.routeButtonTextPrimary}>Depuis ma position</Text></Pressable>
                  <Pressable onPress={() => openRoute(routeOrigin)} style={({ pressed }) => [styles.routeButton, styles.routeButtonSecondary, pressed && styles.pressed]}><IconSymbol name="arrow.clockwise" size={16} color="#0B6B5A" /><Text style={styles.routeButtonTextSecondary}>{routeOrigin.trim() ? "Depuis ce point" : "Ouvrir l’itinéraire"}</Text></Pressable>
                </View>
                <Text style={styles.sheetQuestion}>Vous êtes sur place ? Mettez le statut à jour.</Text>
                <View style={styles.actionRow}>
                  <Pressable onPress={() => reportFromDetail("available")} style={({ pressed }) => [styles.actionButton, styles.actionAvailable, pressed && styles.pressed]}><IconSymbol name="checkmark.circle.fill" size={18} color="#17805F" /><Text style={[styles.actionText, { color: "#17805F" }]}>Il y en a</Text></Pressable>
                  <Pressable onPress={() => reportFromDetail("out")} style={({ pressed }) => [styles.actionButton, styles.actionOut, pressed && styles.pressed]}><IconSymbol name="xmark.circle.fill" size={18} color="#C2413B" /><Text style={[styles.actionText, { color: "#C2413B" }]}>Rupture</Text></Pressable>
                  <Pressable onPress={() => reportFromDetail("unknown")} style={({ pressed }) => [styles.actionButton, styles.actionUnknown, pressed && styles.pressed]}><IconSymbol name="questionmark.circle.fill" size={18} color="#B7791F" /><Text style={[styles.actionText, { color: "#B7791F" }]}>Inconnu</Text></Pressable>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 18, paddingBottom: 36 },
  topBar: { flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 22 },
  brandMark: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#0B6B5A", alignItems: "center", justifyContent: "center", overflow: "hidden", shadowColor: "#0B6B5A", shadowOpacity: 0.18, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  brandLogo: { width: 44, height: 44 },
  brandCopy: { marginLeft: 11, flex: 1 },
  eyebrow: { color: "#7B8B83", fontSize: 10, letterSpacing: 1.3, fontWeight: "800" },
  brandTitle: { color: "#10221D", fontSize: 19, fontWeight: "800", marginTop: 1 },
  liveChip: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6F5EF", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 7 },
  liveDot: { width: 7, height: 7, borderRadius: 5, backgroundColor: "#17805F", marginRight: 6 },
  liveText: { color: "#17805F", fontWeight: "700", fontSize: 11 },
  heroBlock: { paddingBottom: 18 },
  heroTitle: { color: "#10221D", fontSize: 30, lineHeight: 35, fontWeight: "800", letterSpacing: -0.7 },
  heroSubtitle: { color: "#66756F", fontSize: 14, lineHeight: 21, marginTop: 10, maxWidth: 330 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  statCard: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 13, borderWidth: 1, borderColor: "#E2EBE5" },
  statCardGreen: { backgroundColor: "#F0F9F4", borderColor: "#D5EBDD" },
  statCardGold: { backgroundColor: "#FFF9EC", borderColor: "#F3E4C4" },
  statValue: { color: "#10221D", fontWeight: "800", fontSize: 22 },
  statLabel: { color: "#74837C", fontSize: 11, marginTop: 2 },
  searchBox: { height: 52, backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#DCE6E0", flexDirection: "row", alignItems: "center", paddingHorizontal: 14, marginBottom: 12 },
  searchInput: { flex: 1, color: "#10221D", fontSize: 14, marginHorizontal: 10, paddingVertical: 0 },
  filterButton: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  filterRow: { flexDirection: "row", gap: 7, marginBottom: 18 },
  filterPill: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#DCE6E0", backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 11, paddingVertical: 8 },
  filterPillActive: { borderColor: "#0B6B5A", backgroundColor: "#0B6B5A" },
  filterText: { color: "#617169", fontSize: 11, fontWeight: "700" },
  filterTextActive: { color: "#FFFFFF" },
  filterCount: { color: "#92A19A", fontSize: 10, fontWeight: "800", marginLeft: 5 },
  filterCountActive: { color: "#C3E7DA" },
  filterSection: { marginBottom: 18 },
  filterSectionTitle: { color: "#52675D", fontSize: 11, fontWeight: "800", marginBottom: 7 },
  horizontalFilters: { gap: 7, paddingBottom: 8 },
  secondaryPill: { borderWidth: 1, borderColor: "#DCE6E0", backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 11, paddingVertical: 7 },
  secondaryPillActive: { borderColor: "#0B6B5A", backgroundColor: "#E7F4EE" },
  secondaryPillText: { color: "#617169", fontSize: 11, fontWeight: "700" },
  secondaryPillTextActive: { color: "#0B6B5A" },
  nearbyButton: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderWidth: 1, borderColor: "#B9DCCE", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginTop: 3 },
  nearbyButtonActive: { backgroundColor: "#0B6B5A", borderColor: "#0B6B5A" },
  nearbyText: { color: "#0B6B5A", fontSize: 11, fontWeight: "800", marginLeft: 6 },
  nearbyTextActive: { color: "#FFFFFF" },
  locationMessage: { color: "#B7791F", fontSize: 10, marginTop: 7 },
  mapCard: { backgroundColor: "#FFFFFF", borderRadius: 22, padding: 13, borderWidth: 1, borderColor: "#E2EBE5", marginBottom: 23, shadowColor: "#1A3D31", shadowOpacity: 0.07, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  mapHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 3, paddingBottom: 11 },
  mapTitle: { color: "#10221D", fontWeight: "800", fontSize: 16 },
  mapSubtitle: { color: "#8A9891", fontSize: 10, marginTop: 3 },
  mapCount: { alignItems: "flex-end" },
  mapCountValue: { color: "#0B6B5A", fontWeight: "800", fontSize: 18, lineHeight: 19 },
  mapCountLabel: { color: "#81908A", fontSize: 9 },
  mapSurface: { height: 220, backgroundColor: "#EAF5EF", borderRadius: 16, overflow: "hidden", position: "relative" },
  mapOutline: { position: "absolute", top: "9%", left: "28%", width: "47%", height: "82%", borderRadius: 95, borderWidth: 2, borderColor: "#BFDCCB", transform: [{ rotate: "7deg" }] },
  mapRiver: { position: "absolute", width: 2, backgroundColor: "#C8E4ED", opacity: 0.9 },
  mapMarker: { position: "absolute", width: 26, height: 26, alignItems: "center", justifyContent: "center", marginLeft: -13, marginTop: -13 },
  mapMarkerPressed: { transform: [{ scale: 0.88 }], opacity: 0.8 },
  markerHalo: { position: "absolute", width: 25, height: 25, borderRadius: 15 },
  markerCore: { width: 17, height: 17, borderRadius: 9, alignItems: "center", justifyContent: "center", borderWidth: 2, borderColor: "#FFFFFF" },
  mapLabelNorth: { position: "absolute", top: 10, right: 12, width: 22, height: 22, borderRadius: 7, backgroundColor: "#FFFFFFCC", alignItems: "center", justifyContent: "center" },
  mapLabelText: { color: "#5E7D70", fontWeight: "800", fontSize: 11 },
  mapLegend: { position: "absolute", left: 9, right: 9, bottom: 9, flexDirection: "row", justifyContent: "space-between", backgroundColor: "#FFFFFFE6", borderRadius: 10, paddingHorizontal: 9, paddingVertical: 7 },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 7, height: 7, borderRadius: 4, marginRight: 4 },
  legendText: { color: "#56665E", fontSize: 9, fontWeight: "700" },
  mapFootnote: { color: "#93A19A", fontSize: 10, marginTop: 8, marginLeft: 3 },
  sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 },
  sectionTitle: { color: "#10221D", fontSize: 18, fontWeight: "800" },
  sectionSubtitle: { color: "#89968F", fontSize: 11, marginTop: 3 },
  sortLabel: { color: "#8FA098", fontSize: 9, letterSpacing: 0.9, fontWeight: "800", marginBottom: 3 },
  stationCard: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 12, marginBottom: 9, flexDirection: "row", borderWidth: 1, borderColor: "#E2EBE5" },
  stationIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: "#E7F4EE", alignItems: "center", justifyContent: "center" },
  stationMain: { flex: 1, marginLeft: 11 },
  stationTitleRow: { flexDirection: "row", alignItems: "center" },
  stationName: { color: "#1A2D26", fontWeight: "800", fontSize: 14, flex: 1 },
  stationAddress: { color: "#77867E", fontSize: 11, marginTop: 3 },
  stationMetaRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  statusBadge: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderRadius: 20, paddingHorizontal: 9, paddingVertical: 7 },
  statusBadgeCompact: { paddingHorizontal: 7, paddingVertical: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 5, marginRight: 5 },
  statusText: { fontSize: 11, fontWeight: "800" },
  statusTextCompact: { fontSize: 9 },
  updatedText: { color: "#98A49E", fontSize: 10, marginLeft: 8 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  emptyState: { alignItems: "center", paddingVertical: 38 },
  emptyTitle: { color: "#30453B", fontWeight: "800", fontSize: 16, marginTop: 10 },
  emptyText: { color: "#84928A", fontSize: 12, marginTop: 5 },
  modalBackdrop: { flex: 1, backgroundColor: "#0D221A77", justifyContent: "flex-end" },
  sheet: { backgroundColor: "#F9FBF8", borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 19, paddingTop: 9, paddingBottom: 30, minHeight: 330 },
  sheetHandle: { alignSelf: "center", width: 42, height: 4, borderRadius: 3, backgroundColor: "#D0DCD5", marginBottom: 18 },
  sheetHeader: { flexDirection: "row", alignItems: "center", marginBottom: 17 },
  sheetIcon: { width: 49, height: 49, borderRadius: 16, backgroundColor: "#E2F1EA", alignItems: "center", justifyContent: "center" },
  sheetTitleBlock: { flex: 1, marginLeft: 11 },
  sheetTitle: { color: "#152A21", fontSize: 18, fontWeight: "800" },
  sheetSubtitle: { color: "#78877F", fontSize: 12, marginTop: 3 },
  closeButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: "#E8EEE9", alignItems: "center", justifyContent: "center" },
  closeText: { color: "#577066", fontSize: 24, lineHeight: 25, fontWeight: "300" },
  detailLine: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  detailText: { color: "#66766D", fontSize: 12, marginLeft: 8, flex: 1 },
  routeTitle: { color: "#1E342A", fontSize: 14, fontWeight: "800", marginTop: 20, marginBottom: 8 },
  routeInput: { height: 42, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#DCE6E0", borderRadius: 11, paddingHorizontal: 11, color: "#10221D", fontSize: 12 },
  routeActions: { flexDirection: "row", gap: 8, marginTop: 8 },
  routeButton: { flex: 1, minHeight: 42, borderRadius: 11, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingHorizontal: 8 },
  routeButtonPrimary: { backgroundColor: "#0B6B5A" },
  routeButtonSecondary: { backgroundColor: "#E7F4EE", borderWidth: 1, borderColor: "#B9DCCE" },
  routeButtonTextPrimary: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", marginLeft: 5 },
  routeButtonTextSecondary: { color: "#0B6B5A", fontSize: 11, fontWeight: "800", marginLeft: 5 },
  sheetQuestion: { color: "#1E342A", fontSize: 14, fontWeight: "800", marginTop: 24, marginBottom: 10 },
  actionRow: { flexDirection: "row", gap: 8 },
  actionButton: { flex: 1, minHeight: 52, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  actionAvailable: { backgroundColor: "#E9F7EF", borderColor: "#CBEAD8" },
  actionOut: { backgroundColor: "#FFF0EE", borderColor: "#F3D2CE" },
  actionUnknown: { backgroundColor: "#FFF8E9", borderColor: "#F0DFB9" },
  actionText: { fontSize: 11, fontWeight: "800", marginTop: 4 },
});
