import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function AboutScreen() {
  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><Text style={styles.backText}>‹  Retour</Text></Pressable>
        <View style={styles.brandBlock}>
          <Image source={require("@/assets/images/logo_essence_benin.png")} style={styles.logo} />
          <Text style={styles.eyebrow}>MOBILITÉ · INFORMATION · BÉNIN</Text>
          <Text style={styles.title}>Essence Bénin</Text>
          <Text style={styles.lead}>L’application qui aide les conducteurs à trouver une station et à vérifier la disponibilité de l’essence avant de se déplacer.</Text>
        </View>
        <View style={styles.card}><Text style={styles.cardTitle}>Notre mission</Text><Text style={styles.cardText}>Rassembler les stations-service du Bénin dans un annuaire pratique, mettre en évidence les statuts connus et donner aux stations un moyen simple de tenir leurs informations à jour.</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Une information à confirmer</Text><Text style={styles.cardText}>La disponibilité peut évoluer rapidement. Essence Bénin affiche la date et la source du dernier statut lorsqu’elles sont disponibles. Confirmez toujours sur place avant un long déplacement.</Text></View>
        <View style={styles.card}><Text style={styles.cardTitle}>Nous contacter</Text><Text style={styles.cardText}>Pour signaler une information, proposer un partenariat ou demander un accès gestionnaire, écrivez à l’équipe officielle : contact@essence-benin.bj (Cotonou, Bénin).</Text></View>
        <Pressable onPress={() => router.push("/privacy")} style={({ pressed }) => [styles.linkCard, pressed && styles.pressed]}><Text style={styles.linkTitle}>Politique de confidentialité</Text><Text style={styles.linkText}>Lire les données collectées, les finalités et vos droits.</Text><Text style={styles.linkArrow}>›</Text></Pressable>
        <Text style={styles.footer}>Essence Bénin · Version MVP · 2026</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 40 },
  back: { alignSelf: "flex-start", paddingVertical: 8, paddingHorizontal: 2 },
  backText: { color: "#0B6B5A", fontWeight: "800", fontSize: 14 },
  brandBlock: { alignItems: "center", paddingVertical: 14 },
  logo: { width: 112, height: 112, borderRadius: 56, marginBottom: 16 },
  eyebrow: { color: "#8A9890", letterSpacing: 1.2, fontSize: 10, fontWeight: "900", textAlign: "center" },
  title: { color: "#10221D", fontSize: 30, fontWeight: "900", marginTop: 5 },
  lead: { color: "#65756D", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 10, maxWidth: 390 },
  card: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2EBE5", borderRadius: 17, padding: 15, marginTop: 10 },
  cardTitle: { color: "#1E342A", fontSize: 14, fontWeight: "900" },
  cardText: { color: "#718078", fontSize: 12, lineHeight: 18, marginTop: 6 },
  linkCard: { backgroundColor: "#E7F4EE", borderRadius: 17, padding: 15, marginTop: 10, position: "relative" },
  linkTitle: { color: "#0B6B5A", fontWeight: "900", fontSize: 13 },
  linkText: { color: "#55796C", fontSize: 11, marginTop: 4 },
  linkArrow: { position: "absolute", right: 16, top: 17, color: "#0B6B5A", fontSize: 24, fontWeight: "300" },
  footer: { color: "#A0ACA5", fontSize: 10, textAlign: "center", marginTop: 22 },
  pressed: { opacity: 0.7 },
});
