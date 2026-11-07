import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { startOAuthLogin } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { haptic } from "@/lib/haptics";
import { STATUS_COLORS, getStatusLabel, type StationStatus } from "@/lib/stations";
import { trpc } from "@/lib/trpc";

const statuses: StationStatus[] = ["available", "out", "unknown"];

type AdminStation = {
  id: number;
  name: string;
  operator: string;
  city: string;
  latitude: string;
  longitude: string;
  essenceStatus: StationStatus;
  sourceLabel: string;
  sourceUpdatedAt: Date | null;
};

export default function AdminScreen() {
  const { user, loading: authLoading, isAuthenticated, refresh, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const stationsQuery = trpc.stations.adminList.useQuery(undefined, { enabled: isAdmin });
  const updateMutation = trpc.stations.update.useMutation({
    onSuccess: () => {
      void stationsQuery.refetch();
      haptic.success();
    },
  });
  const [selected, setSelected] = useState<AdminStation | null>(null);
  const [accessStation, setAccessStation] = useState<AdminStation | null>(null);
  const [newStationOpen, setNewStationOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [note, setNote] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerPassword, setPartnerPassword] = useState("");
  const [partnerDuration, setPartnerDuration] = useState("60");
  const [newName, setNewName] = useState("");
  const [newOperator, setNewOperator] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newLatitude, setNewLatitude] = useState("");
  const [newLongitude, setNewLongitude] = useState("");
  const createStationMutation = trpc.stations.create.useMutation({
    onSuccess: () => { void stationsQuery.refetch(); setNewStationOpen(false); setNewName(""); setNewOperator(""); setNewCity(""); setNewAddress(""); setNewLatitude(""); setNewLongitude(""); },
    onError: (error) => Alert.alert("Création impossible", error.message),
  });
  const createPartnerMutation = trpc.stations.createPartnerAccess.useMutation({
    onSuccess: () => { Alert.alert("Accès créé", "Transmettez ces identifiants au responsable de la station."); setAccessStation(null); setPartnerEmail(""); setPartnerPassword(""); },
    onError: (error) => Alert.alert("Création impossible", error.message),
  });

  useEffect(() => {
    if (!selected) return;
    setName(selected.name);
    setCity(selected.city);
    setLatitude(selected.latitude);
    setLongitude(selected.longitude);
    setNote("");
  }, [selected]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return (stationsQuery.data ?? []).filter((station) =>
      !normalized || `${station.name} ${station.city} ${station.operator}`.toLowerCase().includes(normalized),
    );
  }, [query, stationsQuery.data]);

  const save = () => {
    if (!selected) return;
    updateMutation.mutate({
      id: selected.id,
      name: name.trim(),
      city: city.trim(),
      latitude: latitude.trim(),
      longitude: longitude.trim(),
      note: note.trim() || undefined,
    });
    setSelected(null);
  };

  const changeStatus = (station: AdminStation, status: StationStatus) => {
    updateMutation.mutate({
      id: station.id,
      essenceStatus: status,
      confidence: "partner",
      note: `Mise à jour admin depuis l’application${note.trim() ? ` — ${note.trim()}` : ""}`,
    });
  };

  if (authLoading) {
    return <ScreenContainer><View style={styles.center}><ActivityIndicator color="#0B6B5A" /><Text style={styles.muted}>Vérification de l’accès…</Text></View></ScreenContainer>;
  }

  if (!isAuthenticated) {
    return (
      <ScreenContainer className="p-5">
        <View style={styles.authCard}>
          <View style={styles.headerIcon}><IconSymbol name="info.circle.fill" size={24} color="#FFFFFF" /></View>
          <Text style={styles.title}>Accès administrateur</Text>
          <Text style={styles.copy}>Connectez-vous avec le compte propriétaire de l’application pour modifier les stations et leurs disponibilités.</Text>
          <Pressable onPress={() => void startOAuthLogin()} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>Se connecter</Text></Pressable>
        </View>
      </ScreenContainer>
    );
  }

  if (!isAdmin) {
    return (
      <ScreenContainer className="p-5">
        <View style={styles.authCard}>
          <Text style={styles.title}>Accès limité</Text>
          <Text style={styles.copy}>Votre compte est connecté, mais il n’a pas le rôle administrateur. Le propriétaire doit vous l’attribuer avant toute modification.</Text>
          <Pressable onPress={() => void logout()} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryButtonText}>Se déconnecter</Text></Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <View style={styles.pageHeader}>
              <View style={styles.headerIcon}><IconSymbol name="info.circle.fill" size={23} color="#FFFFFF" /></View>
              <View style={{ flex: 1 }}><Text style={styles.eyebrow}>ESPACE PROPRIÉTAIRE</Text><Text style={styles.title}>Administration</Text></View>
              <Pressable onPress={() => setNewStationOpen(true)} style={({ pressed }) => [styles.partnerButton, pressed && styles.pressed]}><Text style={styles.partnerButtonText}>+ Station</Text></Pressable>
              <Pressable onPress={() => { void stationsQuery.refetch(); void refresh(); }} style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}><IconSymbol name="arrow.clockwise" size={19} color="#0B6B5A" /></Pressable>
            </View>
            <Text style={styles.copy}>Modifiez une station, son statut essence et la source de vérification. Chaque changement est historisé.</Text>
            <View style={styles.summary}><Text style={styles.summaryValue}>{stationsQuery.data?.length ?? 0}</Text><Text style={styles.summaryLabel}>stations gérées</Text><Text style={styles.summaryUser}>{user?.email ?? user?.name ?? "Compte admin"}</Text></View>
            <View style={styles.searchBox}><IconSymbol name="magnifyingglass" size={18} color="#7A8A82" /><TextInput value={query} onChangeText={setQuery} placeholder="Rechercher une station…" placeholderTextColor="#98A69F" style={styles.searchInput} /></View>
            {stationsQuery.isLoading ? <ActivityIndicator color="#0B6B5A" style={{ marginVertical: 16 }} /> : null}
            {stationsQuery.error ? <Text style={styles.error}>Impossible de charger les stations. Vérifiez votre accès administrateur.</Text> : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.stationCard}>
            <View style={styles.cardTop}>
              <View style={styles.stationIcon}><IconSymbol name="fuelpump.fill" size={19} color="#0B6B5A" /></View>
              <View style={{ flex: 1, marginLeft: 10 }}><Text style={styles.stationName} numberOfLines={1}>{item.name}</Text><Text style={styles.stationAddress}>{item.city} · {item.operator}</Text></View>
              <Pressable onPress={() => setSelected(item)} style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}><Text style={styles.editButtonText}>Modifier</Text></Pressable>
            </View>
            <Text style={styles.statusLabel}>ESSENCE · {getStatusLabel(item.essenceStatus)}</Text>
            <View style={styles.statusRow}>
              {statuses.map((status) => <Pressable key={status} onPress={() => changeStatus(item, status)} style={({ pressed }) => [styles.statusButton, item.essenceStatus === status && { borderColor: STATUS_COLORS[status], backgroundColor: `${STATUS_COLORS[status]}16` }, pressed && styles.pressed]}><View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] }]} /><Text style={[styles.statusButtonText, item.essenceStatus === status && { color: STATUS_COLORS[status] }]}>{status === "available" ? "Disponible" : status === "out" ? "Rupture" : "À vérifier"}</Text></Pressable>)}
            </View>
            <Text style={styles.source}>{item.sourceLabel} · {item.sourceUpdatedAt ? new Date(item.sourceUpdatedAt).toLocaleDateString("fr-FR") : "sans date"}</Text>
            <Pressable onPress={() => setAccessStation(item)} style={({ pressed }) => [styles.partnerButton, pressed && styles.pressed]}><Text style={styles.partnerButtonText}>Créer un accès partenaire</Text></Pressable>
          </View>
        )}
        ListEmptyComponent={<View style={styles.center}><Text style={styles.muted}>Aucune station trouvée.</Text></View>}
      />

      {selected ? <View style={styles.editorOverlay}><View style={styles.editorCard}><Text style={styles.editorTitle}>Modifier la station</Text><Text style={styles.editorSubtitle}>{selected.operator}</Text><TextInput value={name} onChangeText={setName} placeholder="Nom" style={styles.field} /><TextInput value={city} onChangeText={setCity} placeholder="Ville" style={styles.field} /><View style={styles.fieldsRow}><TextInput value={latitude} onChangeText={setLatitude} placeholder="Latitude" keyboardType="decimal-pad" style={[styles.field, styles.halfField]} /><TextInput value={longitude} onChangeText={setLongitude} placeholder="Longitude" keyboardType="decimal-pad" style={[styles.field, styles.halfField]} /></View><TextInput value={note} onChangeText={setNote} placeholder="Note de vérification (optionnel)" style={[styles.field, styles.noteField]} /><View style={styles.editorActions}><Pressable onPress={() => setSelected(null)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryButtonText}>Annuler</Text></Pressable><Pressable onPress={save} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>{updateMutation.isPending ? "Enregistrement…" : "Enregistrer"}</Text></Pressable></View></View></View> : null}
      {accessStation ? <View style={styles.editorOverlay}><View style={styles.editorCard}><Text style={styles.editorTitle}>Accès temporaire</Text><Text style={styles.editorSubtitle}>{accessStation.name} · limité à la disponibilité essence</Text><TextInput value={partnerEmail} onChangeText={setPartnerEmail} placeholder="Email du responsable" autoCapitalize="none" keyboardType="email-address" style={styles.field} /><TextInput value={partnerPassword} onChangeText={setPartnerPassword} placeholder="Mot de passe (10 caractères minimum)" secureTextEntry style={styles.field} /><TextInput value={partnerDuration} onChangeText={setPartnerDuration} placeholder="Durée en minutes (60 par défaut)" keyboardType="number-pad" style={styles.field} /><View style={styles.editorActions}><Pressable onPress={() => setAccessStation(null)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryButtonText}>Annuler</Text></Pressable><Pressable onPress={() => createPartnerMutation.mutate({ stationId: accessStation.id, email: partnerEmail.trim(), password: partnerPassword, durationMinutes: Number(partnerDuration) || 60 })} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>{createPartnerMutation.isPending ? "Création…" : "Créer l’accès"}</Text></Pressable></View></View></View> : null}
      {newStationOpen ? <View style={styles.editorOverlay}><View style={styles.editorCard}><Text style={styles.editorTitle}>Ajouter une station</Text><Text style={styles.editorSubtitle}>L’accès de saisie peut ensuite être transmis pendant une heure.</Text><TextInput value={newName} onChangeText={setNewName} placeholder="Nom de la station" style={styles.field} /><TextInput value={newOperator} onChangeText={setNewOperator} placeholder="Opérateur (Oryx, Ewell…)" style={styles.field} /><TextInput value={newCity} onChangeText={setNewCity} placeholder="Ville" style={styles.field} /><TextInput value={newAddress} onChangeText={setNewAddress} placeholder="Adresse" style={styles.field} /><View style={styles.fieldsRow}><TextInput value={newLatitude} onChangeText={setNewLatitude} placeholder="Latitude" keyboardType="decimal-pad" style={[styles.field, styles.halfField]} /><TextInput value={newLongitude} onChangeText={setNewLongitude} placeholder="Longitude" keyboardType="decimal-pad" style={[styles.field, styles.halfField]} /></View><View style={styles.editorActions}><Pressable onPress={() => setNewStationOpen(false)} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}><Text style={styles.secondaryButtonText}>Annuler</Text></Pressable><Pressable onPress={() => createStationMutation.mutate({ sourceId: `manual-${Date.now()}`, name: newName.trim(), operator: newOperator.trim() || "À confirmer", city: newCity.trim(), address: newAddress.trim() || null, latitude: newLatitude.trim(), longitude: newLongitude.trim() })} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}><Text style={styles.primaryButtonText}>{createStationMutation.isPending ? "Création…" : "Créer la station"}</Text></Pressable></View></View></View> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 36 },
  pageHeader: { flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 13 },
  headerIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#0B6B5A", alignItems: "center", justifyContent: "center", marginRight: 12 },
  eyebrow: { color: "#8E9A93", fontSize: 10, letterSpacing: 1.1, fontWeight: "800" },
  title: { color: "#10221D", fontSize: 24, fontWeight: "800", marginTop: 2 },
  copy: { color: "#65756D", fontSize: 13, lineHeight: 20, marginBottom: 15 },
  authCard: { marginTop: 70, backgroundColor: "#FFFFFF", borderRadius: 22, padding: 22, borderWidth: 1, borderColor: "#E2EBE5" },
  primaryButton: { backgroundColor: "#0B6B5A", borderRadius: 12, minHeight: 44, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  primaryButtonText: { color: "#FFFFFF", fontWeight: "800", fontSize: 12 },
  secondaryButton: { backgroundColor: "#EEF5F1", borderRadius: 12, minHeight: 44, paddingHorizontal: 16, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: "#0B6B5A", fontWeight: "800", fontSize: 12 },
  summary: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7F4EE", borderRadius: 15, padding: 13, marginBottom: 12 },
  summaryValue: { color: "#0B6B5A", fontSize: 22, fontWeight: "900" },
  summaryLabel: { color: "#477466", fontSize: 11, marginLeft: 7 },
  summaryUser: { color: "#6C8278", fontSize: 10, marginLeft: "auto" },
  iconButton: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#E7F4EE", alignItems: "center", justifyContent: "center" },
  searchBox: { height: 48, backgroundColor: "#FFFFFF", borderRadius: 14, borderWidth: 1, borderColor: "#DCE6E0", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, color: "#10221D", fontSize: 13, marginLeft: 8 },
  stationCard: { backgroundColor: "#FFFFFF", borderRadius: 17, padding: 13, borderWidth: 1, borderColor: "#E2EBE5", marginBottom: 10 },
  cardTop: { flexDirection: "row", alignItems: "center" },
  stationIcon: { width: 38, height: 38, borderRadius: 12, backgroundColor: "#E7F4EE", alignItems: "center", justifyContent: "center" },
  stationName: { color: "#1A2D26", fontSize: 13, fontWeight: "800" },
  stationAddress: { color: "#819087", fontSize: 10, marginTop: 3 },
  editButton: { backgroundColor: "#F2F7F4", borderRadius: 9, paddingHorizontal: 9, paddingVertical: 7 },
  editButtonText: { color: "#0B6B5A", fontSize: 10, fontWeight: "800" },
  statusLabel: { color: "#8A9790", fontSize: 9, letterSpacing: 0.8, fontWeight: "900", marginTop: 13, marginBottom: 7 },
  statusRow: { flexDirection: "row", gap: 6 },
  statusButton: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#DCE6E0", minHeight: 34, alignItems: "center", justifyContent: "center", flexDirection: "row" },
  statusButtonText: { color: "#6F7E76", fontSize: 9, fontWeight: "800" },
  dot: { width: 6, height: 6, borderRadius: 4, marginRight: 4 },
  source: { color: "#9AA69F", fontSize: 9, marginTop: 9 },
  partnerButton: { alignSelf: "flex-start", backgroundColor: "#E7F4EE", borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  partnerButtonText: { color: "#0B6B5A", fontSize: 10, fontWeight: "800" },
  center: { alignItems: "center", justifyContent: "center", padding: 40 },
  muted: { color: "#7D8D85", fontSize: 12, marginTop: 10 },
  error: { color: "#C2413B", backgroundColor: "#FFF1EF", borderRadius: 10, padding: 10, fontSize: 11, marginBottom: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  editorOverlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "rgba(16,34,29,0.35)", justifyContent: "flex-end" },
  editorCard: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 18 },
  editorTitle: { color: "#10221D", fontSize: 20, fontWeight: "800" },
  editorSubtitle: { color: "#809087", fontSize: 11, marginBottom: 12, marginTop: 3 },
  field: { height: 44, borderRadius: 11, borderWidth: 1, borderColor: "#DCE6E0", paddingHorizontal: 12, color: "#10221D", fontSize: 12, marginBottom: 8 },
  fieldsRow: { flexDirection: "row", gap: 8 },
  halfField: { flex: 1 },
  noteField: { height: 52 },
  editorActions: { flexDirection: "row", gap: 8, marginTop: 5 },
});
