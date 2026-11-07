import { View, Text, StyleSheet } from "react-native";
import type { Station } from "@/lib/stations";

export function BeninMap({ stations }: { stations: Station[]; onSelect: (station: Station) => void }) {
  return <View style={styles.fallback}><Text style={styles.title}>Carte du Bénin</Text><Text style={styles.text}>{stations.length} stations recensées. Ouvrez l’aperçu web pour la carte interactive.</Text></View>;
}

const styles = StyleSheet.create({
  fallback: { height: 220, borderRadius: 16, backgroundColor: "#EAF5EF", justifyContent: "center", alignItems: "center", padding: 20 },
  title: { color: "#174F40", fontSize: 16, fontWeight: "800" },
  text: { color: "#6F847A", fontSize: 11, textAlign: "center", marginTop: 6 },
});
