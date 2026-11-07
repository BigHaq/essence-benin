import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { STATUS_COLORS } from "@/lib/stations";
import { useStations } from "@/lib/stations-context";

export default function InfoScreen() {
  const { stations, overrideCount } = useStations();
  return (
    <ScreenContainer edges={["top", "left", "right"]} containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}><View style={styles.headerIcon}><Image source={require("@/assets/images/logo_essence_benin.png")} style={styles.headerLogo} /></View><View><Text style={styles.eyebrow}>À PROPOS DE L’APP</Text><Text style={styles.title}>Bien utiliser Essence Bénin</Text></View></View>
        <Text style={styles.lead}>Un annuaire terrain pour trouver rapidement une station et partager une information utile à la communauté.</Text>
        <View style={styles.heroCard}><View style={styles.heroIcon}><IconSymbol name="fuelpump.fill" size={26} color="#FFFFFF" /></View><View style={styles.heroCopy}><Text style={styles.heroTitle}>{stations.length} stations dans le catalogue</Text><Text style={styles.heroText}>dont {overrideCount} statut{overrideCount > 1 ? "s" : ""} mis à jour sur cet appareil</Text></View></View>
        <Text style={styles.sectionLabel}>COMMENT LIRE LES STATUTS</Text>
        <View style={styles.guideCard}>
          <View style={styles.guideRow}><View style={[styles.guideIcon, { backgroundColor: "#E8F6EE" }]}><View style={[styles.guideDot, { backgroundColor: STATUS_COLORS.available }]} /></View><View style={styles.guideCopy}><Text style={styles.guideTitle}>Essence disponible</Text><Text style={styles.guideText}>Un signalement récent indique que la station sert de l’essence.</Text></View></View>
          <View style={styles.separator} />
          <View style={styles.guideRow}><View style={[styles.guideIcon, { backgroundColor: "#FFF0EE" }]}><View style={[styles.guideDot, { backgroundColor: STATUS_COLORS.out }]} /></View><View style={styles.guideCopy}><Text style={styles.guideTitle}>Rupture signalée</Text><Text style={styles.guideText}>Un conducteur a indiqué une absence d’essence. Vérifiez l’heure du statut.</Text></View></View>
          <View style={styles.separator} />
          <View style={styles.guideRow}><View style={[styles.guideIcon, { backgroundColor: "#FFF7E7" }]}><View style={[styles.guideDot, { backgroundColor: STATUS_COLORS.unknown }]} /></View><View style={styles.guideCopy}><Text style={styles.guideTitle}>À vérifier</Text><Text style={styles.guideText}>Aucun statut suffisamment récent n’est disponible.</Text></View></View>
        </View>
        <Text style={styles.sectionLabel}>SOURCE ET FIABILITÉ</Text>
        <View style={styles.noteCard}><IconSymbol name="location.fill" size={20} color="#0B6B5A" /><View style={styles.noteCopy}><Text style={styles.noteTitle}>Une information collaborative</Text><Text style={styles.noteText}>Le catalogue initial est un socle de démonstration à valider. La disponibilité peut changer à tout moment : utilisez l’heure du dernier signalement et confirmez sur place avant de vous déplacer.</Text></View></View>
        <View style={styles.noteCard}><IconSymbol name="arrow.clockwise" size={20} color="#B7791F" /><View style={styles.noteCopy}><Text style={styles.noteTitle}>Mise à jour progressive</Text><Text style={styles.noteText}>Dans cette version, les signalements restent sur l’appareil. La prochaine étape consiste à les synchroniser dans une base partagée et à importer une liste officielle ou OpenStreetMap validée.</Text></View></View>
        <Pressable onPress={() => router.push("/about")} style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}><Text style={styles.linkTitle}>Découvrir Essence Bénin</Text><Text style={styles.linkText}>Notre mission, le logo officiel et les informations de contact.</Text><Text style={styles.linkArrow}>›</Text></Pressable>
        <Pressable onPress={() => router.push("/privacy")} style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}><Text style={styles.linkTitle}>Politique de confidentialité</Text><Text style={styles.linkText}>Comprendre les données utilisées et vos choix.</Text><Text style={styles.linkArrow}>›</Text></Pressable>
        <Text style={styles.footer}>Version MVP · conçu pour le terrain béninois</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 35 },
  headerRow: { flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 15 },
  headerIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#0B6B5A", alignItems: "center", justifyContent: "center", marginRight: 12, overflow: "hidden" },
  headerLogo: { width: 46, height: 46 },
  eyebrow: { color: "#8E9A93", fontSize: 10, letterSpacing: 1.1, fontWeight: "800" },
  title: { color: "#10221D", fontSize: 21, fontWeight: "800", marginTop: 2 },
  lead: { color: "#65756D", fontSize: 14, lineHeight: 21, marginBottom: 16 },
  heroCard: { backgroundColor: "#0B6B5A", borderRadius: 19, padding: 16, flexDirection: "row", alignItems: "center", marginBottom: 24 },
  heroIcon: { width: 50, height: 50, borderRadius: 16, backgroundColor: "#2A8A76", alignItems: "center", justifyContent: "center" },
  heroCopy: { marginLeft: 12, flex: 1 },
  heroTitle: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  heroText: { color: "#BDE4D7", fontSize: 11, marginTop: 4 },
  sectionLabel: { color: "#87958D", fontSize: 10, letterSpacing: 0.9, fontWeight: "800", marginBottom: 9 },
  guideCard: { backgroundColor: "#FFFFFF", borderRadius: 18, borderWidth: 1, borderColor: "#E2EBE5", padding: 14, marginBottom: 24 },
  guideRow: { flexDirection: "row", alignItems: "center" },
  guideIcon: { width: 37, height: 37, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  guideDot: { width: 11, height: 11, borderRadius: 6 },
  guideCopy: { flex: 1, marginLeft: 10 },
  guideTitle: { color: "#1E342A", fontWeight: "800", fontSize: 13 },
  guideText: { color: "#7A8981", fontSize: 11, lineHeight: 16, marginTop: 3 },
  separator: { height: 1, backgroundColor: "#EDF2EE", marginVertical: 13 },
  noteCard: { backgroundColor: "#FFFFFF", borderRadius: 16, borderWidth: 1, borderColor: "#E2EBE5", padding: 13, flexDirection: "row", alignItems: "flex-start", marginBottom: 9 },
  noteCopy: { flex: 1, marginLeft: 10 },
  noteTitle: { color: "#1E342A", fontWeight: "800", fontSize: 13 },
  noteText: { color: "#7A8981", fontSize: 11, lineHeight: 16, marginTop: 4 },
  footer: { color: "#A0ACA5", fontSize: 10, textAlign: "center", marginTop: 18 },
  linkCard: { backgroundColor: "#E7F4EE", borderRadius: 16, padding: 14, marginTop: 9, position: "relative" },
  linkTitle: { color: "#0B6B5A", fontWeight: "900", fontSize: 13 },
  linkText: { color: "#55796C", fontSize: 11, marginTop: 4 },
  linkArrow: { position: "absolute", right: 15, top: 13, color: "#0B6B5A", fontSize: 24 },
  pressed: { opacity: 0.72 },
});
