import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { getApiBaseUrl } from "@/constants/oauth";
import { useAuth } from "@/hooks/use-auth";
import { haptic } from "@/lib/haptics";
import { getStatusLabel, STATUS_COLORS, type StationStatus } from "@/lib/stations";
import { trpc } from "@/lib/trpc";

export default function PartnerScreen() {
  const { user, loading: authLoading, refresh, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const stationQuery = trpc.stations.partnerMe.useQuery(undefined, { enabled: user?.role === "partner" });
  const updateMutation = trpc.stations.partnerUpdateStatus.useMutation({
    onSuccess: () => { void stationQuery.refetch(); haptic.success(); },
    onError: (error) => Alert.alert("Mise à jour impossible", error.message),
  });

  const login = async () => {
    setLoginLoading(true);
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/partner/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "Connexion impossible");
      await refresh();
      setPassword("");
    } catch (error) {
      Alert.alert("Connexion partenaire", error instanceof Error ? error.message : "Connexion impossible");
    } finally {
      setLoginLoading(false);
    }
  };

  if (authLoading) return <ScreenContainer><View style={styles.center}><ActivityIndicator color="#0B6B5A" /></View></ScreenContainer>;

  if (user?.role !== "partner") {
    return <ScreenContainer className="p-5"><View style={styles.card}>
      <Text style={styles.eyebrow}>ACCÈS STATION</Text>
      <Text style={styles.title}>Espace partenaire</Text>
      <Text style={styles.copy}>Utilisez les identifiants transmis par le propriétaire. Cet accès est temporaire et ne permet de modifier que la disponibilité de votre station.</Text>
      <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Email de la station" placeholderTextColor="#98A69F" style={styles.field} />
      <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe temporaire" placeholderTextColor="#98A69F" style={styles.field} />
      <Pressable onPress={() => void login()} disabled={loginLoading} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}><Text style={styles.primaryText}>{loginLoading ? "Connexion…" : "Se connecter"}</Text></Pressable>
    </View></ScreenContainer>;
  }

  const station = stationQuery.data;
  if (!station) return <ScreenContainer><View style={styles.center}><ActivityIndicator color="#0B6B5A" /></View></ScreenContainer>;

  return <ScreenContainer className="p-5"><View style={styles.card}>
    <Text style={styles.eyebrow}>ESPACE PARTENAIRE</Text>
    <Text style={styles.title}>{station.name}</Text>
    <Text style={styles.copy}>{station.city} · {station.operator}</Text>
    <Text style={styles.statusLabel}>DISPONIBILITÉ ESSENCE</Text>
    <View style={[styles.currentStatus, { backgroundColor: `${STATUS_COLORS[station.essenceStatus]}18` }]}><View style={[styles.dot, { backgroundColor: STATUS_COLORS[station.essenceStatus] }]} /><Text style={{ color: STATUS_COLORS[station.essenceStatus], fontWeight: "800" }}>{getStatusLabel(station.essenceStatus)}</Text></View>
    <View style={styles.actions}>
      {(["available", "out", "unknown"] as StationStatus[]).map((status) => <Pressable key={status} onPress={() => updateMutation.mutate({ essenceStatus: status })} disabled={updateMutation.isPending} style={({ pressed }) => [styles.statusButton, pressed && styles.pressed]}><View style={[styles.dot, { backgroundColor: STATUS_COLORS[status] }]} /><Text style={styles.statusText}>{status === "available" ? "Essence disponible" : status === "out" ? "Rupture" : "À vérifier"}</Text></Pressable>)}
    </View>
    <Pressable onPress={() => void logout()} style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}><Text style={styles.secondaryText}>Se déconnecter</Text></Pressable>
  </View></ScreenContainer>;
}

const styles = StyleSheet.create({
  card: { marginTop: 35, backgroundColor: "#FFFFFF", borderRadius: 22, padding: 20, borderWidth: 1, borderColor: "#E2EBE5" },
  eyebrow: { color: "#7B8B83", fontSize: 10, letterSpacing: 1.2, fontWeight: "800" },
  title: { color: "#10221D", fontSize: 24, fontWeight: "800", marginTop: 6 },
  copy: { color: "#66756F", fontSize: 13, lineHeight: 20, marginTop: 8, marginBottom: 16 },
  field: { height: 46, borderWidth: 1, borderColor: "#DCE6E0", borderRadius: 12, paddingHorizontal: 12, color: "#10221D", marginBottom: 9 },
  primary: { minHeight: 46, borderRadius: 12, backgroundColor: "#0B6B5A", alignItems: "center", justifyContent: "center", marginTop: 5 },
  primaryText: { color: "#FFFFFF", fontWeight: "800" },
  statusLabel: { color: "#8A9790", fontSize: 10, letterSpacing: 0.8, fontWeight: "900", marginTop: 14, marginBottom: 8 },
  currentStatus: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 12 },
  dot: { width: 8, height: 8, borderRadius: 5, marginRight: 7 },
  actions: { gap: 8, marginTop: 14 },
  statusButton: { minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: "#DCE6E0", flexDirection: "row", alignItems: "center", paddingHorizontal: 13 },
  statusText: { color: "#30453B", fontSize: 12, fontWeight: "800" },
  secondary: { minHeight: 42, borderRadius: 12, backgroundColor: "#EEF5F1", alignItems: "center", justifyContent: "center", marginTop: 14 },
  secondaryText: { color: "#0B6B5A", fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});
