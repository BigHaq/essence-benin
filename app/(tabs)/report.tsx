import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { haptic } from "@/lib/haptics";
import { getStatusLabel, STATUS_COLORS, type StationStatus } from "@/lib/stations";
import { useStations } from "@/lib/stations-context";

const statusOptions: { value: StationStatus; label: string; icon: "checkmark.circle.fill" | "xmark.circle.fill" | "questionmark.circle.fill" }[] = [
  { value: "available", label: "Essence", icon: "checkmark.circle.fill" },
  { value: "out", label: "Rupture", icon: "xmark.circle.fill" },
  { value: "unknown", label: "Inconnu", icon: "questionmark.circle.fill" },
];

export default function ReportScreen() {
  const { stations, updateStatus } = useStations();
  const [query, setQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<StationStatus>("available");
  const [lastReportedId, setLastReportedId] = useState<string | null>(null);

  const visibleStations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return stations.filter((station) => !normalized || `${station.name} ${station.city} ${station.district}`.toLowerCase().includes(normalized));
  }, [query, stations]);

  const report = (stationId: string) => {
    updateStatus(stationId, selectedStatus);
    setLastReportedId(stationId);
    haptic.success();
    setTimeout(() => setLastReportedId(null), 1800);
  };

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <FlatList
        data={visibleStations}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        renderItem={({ item }) => (
          <View style={styles.stationCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.stationIcon}><IconSymbol name="fuelpump.fill" size={19} color="#0B6B5A" /></View>
              <View style={styles.stationCopy}><Text style={styles.stationName} numberOfLines={1}>{item.name}</Text><Text style={styles.stationAddress}>{item.city} · {item.district}</Text></View>
              <View style={[styles.miniStatus, { backgroundColor: `${STATUS_COLORS[item.status]}18` }]}><View style={[styles.miniDot, { backgroundColor: STATUS_COLORS[item.status] }]} /><Text style={[styles.miniStatusText, { color: STATUS_COLORS[item.status] }]}>{item.status === "available" ? "OK" : item.status === "out" ? "RUP" : "?"}</Text></View>
            </View>
            <Pressable onPress={() => report(item.id)} style={({ pressed }) => [styles.reportButton, lastReportedId === item.id && styles.reportButtonDone, pressed && styles.pressed]}>
              <IconSymbol name={lastReportedId === item.id ? "checkmark.circle.fill" : "flag.fill"} size={17} color={lastReportedId === item.id ? "#17805F" : "#FFFFFF"} />
              <Text style={[styles.reportButtonText, lastReportedId === item.id && styles.reportButtonTextDone]}>{lastReportedId === item.id ? "Signalement enregistré" : `Signaler : ${getStatusLabel(selectedStatus)}`}</Text>
            </Pressable>
          </View>
        )}
        ListHeaderComponent={
          <View>
            <View style={styles.pageHeader}>
              <View style={styles.headerIcon}><IconSymbol name="flag.fill" size={23} color="#FFFFFF" /></View>
              <View><Text style={styles.eyebrow}>CONTRIBUTION TERRAIN</Text><Text style={styles.title}>Signaler un statut</Text></View>
            </View>
            <Text style={styles.intro}>Vous êtes devant une station ? Aidez les autres conducteurs à savoir si l’essence est disponible.</Text>
            <View style={styles.localNotice}><IconSymbol name="info.circle.fill" size={17} color="#7A6A41" /><Text style={styles.localNoticeText}>Les signalements sont conservés localement sur cet appareil dans cette première version.</Text></View>
            <Text style={styles.stepLabel}>1 · QUE VOYEZ-VOUS ?</Text>
            <View style={styles.statusSelector}>
              {statusOptions.map((option) => {
                const active = selectedStatus === option.value;
                return <Pressable key={option.value} onPress={() => { haptic.light(); setSelectedStatus(option.value); }} style={({ pressed }) => [styles.statusOption, active && { backgroundColor: `${STATUS_COLORS[option.value]}18`, borderColor: STATUS_COLORS[option.value] }, pressed && styles.pressed]}><IconSymbol name={option.icon} size={19} color={active ? STATUS_COLORS[option.value] : "#8B9992"} /><Text style={[styles.statusOptionText, active && { color: STATUS_COLORS[option.value] }]}>{option.label}</Text></Pressable>;
              })}
            </View>
            <Text style={styles.stepLabel}>2 · CHOISISSEZ LA STATION</Text>
            <View style={styles.searchBox}><IconSymbol name="magnifyingglass" size={19} color="#7A8A82" /><TextInput value={query} onChangeText={setQuery} placeholder="Rechercher par nom ou ville" placeholderTextColor="#98A69F" style={styles.searchInput} /></View>
            <Text style={styles.resultHint}>{visibleStations.length} station{visibleStations.length > 1 ? "s" : ""} à proximité dans le catalogue</Text>
          </View>
        }
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>Station introuvable</Text><Text style={styles.emptyText}>Essayez avec un autre nom de ville.</Text></View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 35 },
  pageHeader: { flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 15 },
  headerIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#B7791F", alignItems: "center", justifyContent: "center", marginRight: 12 },
  eyebrow: { color: "#8E9A93", fontSize: 10, letterSpacing: 1.1, fontWeight: "800" },
  title: { color: "#10221D", fontSize: 23, fontWeight: "800", marginTop: 2 },
  intro: { color: "#65756D", fontSize: 14, lineHeight: 21, marginBottom: 15 },
  localNotice: { flexDirection: "row", backgroundColor: "#FFF7E6", borderRadius: 14, borderWidth: 1, borderColor: "#F2E1B9", padding: 11, alignItems: "flex-start", marginBottom: 21 },
  localNoticeText: { color: "#75643D", fontSize: 11, lineHeight: 16, marginLeft: 8, flex: 1 },
  stepLabel: { color: "#85938B", fontSize: 10, fontWeight: "800", letterSpacing: 0.9, marginBottom: 9 },
  statusSelector: { flexDirection: "row", gap: 7, marginBottom: 22 },
  statusOption: { flex: 1, minHeight: 57, borderRadius: 14, borderWidth: 1, borderColor: "#DCE6E0", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  statusOptionText: { color: "#6F7E76", fontSize: 10, fontWeight: "800", marginTop: 4 },
  searchBox: { height: 50, backgroundColor: "#FFFFFF", borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E0", flexDirection: "row", alignItems: "center", paddingHorizontal: 13, marginBottom: 8 },
  searchInput: { flex: 1, color: "#10221D", fontSize: 13, marginLeft: 9, paddingVertical: 0 },
  resultHint: { color: "#95A19B", fontSize: 11, marginBottom: 12 },
  stationCard: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 12, borderWidth: 1, borderColor: "#E2EBE5", marginBottom: 9 },
  cardTopRow: { flexDirection: "row", alignItems: "center" },
  stationIcon: { width: 39, height: 39, borderRadius: 12, backgroundColor: "#E7F4EE", alignItems: "center", justifyContent: "center" },
  stationCopy: { marginLeft: 10, flex: 1 },
  stationName: { color: "#1A2D26", fontSize: 13, fontWeight: "800" },
  stationAddress: { color: "#819087", fontSize: 10, marginTop: 3 },
  miniStatus: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12 },
  miniDot: { width: 6, height: 6, borderRadius: 4, marginRight: 4 },
  miniStatusText: { fontSize: 9, fontWeight: "900" },
  reportButton: { height: 42, borderRadius: 12, backgroundColor: "#0B6B5A", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 11 },
  reportButtonDone: { backgroundColor: "#E7F6EE", borderWidth: 1, borderColor: "#C5E8D3" },
  reportButtonText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800", marginLeft: 7 },
  reportButtonTextDone: { color: "#17805F" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.99 }] },
  empty: { alignItems: "center", paddingVertical: 30 },
  emptyTitle: { color: "#30453B", fontWeight: "800", fontSize: 15 },
  emptyText: { color: "#84928A", fontSize: 12, marginTop: 4 },
});
