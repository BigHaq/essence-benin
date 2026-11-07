import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

export default function PrivacyScreen() {
  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><Text style={styles.backText}>‹  Retour</Text></Pressable>
        <Text style={styles.eyebrow}>ESSENCE BÉNIN</Text>
        <Text style={styles.title}>Politique de confidentialité</Text>
        <Text style={styles.updated}>Dernière mise à jour : 10 octobre 2026</Text>
        <Text style={styles.intro}>Cette politique explique, en termes simples, quelles données peuvent être utilisées par Essence Bénin et pourquoi.</Text>
        <Section title="1. Données utilisées"><Text>Les stations, leurs coordonnées, leurs opérateurs et leurs statuts de disponibilité sont utilisés pour afficher le catalogue et aider les conducteurs à choisir une station.</Text><Text>Si vous activez la fonction « à proximité », la position de votre appareil sert à calculer une distance locale. Elle n’est pas nécessaire pour consulter le catalogue.</Text><Text>Un partenaire station peut utiliser une adresse e-mail professionnelle et un compte temporaire afin de mettre à jour uniquement sa station.</Text></Section>
        <Section title="2. Finalités"><Text>Les données servent à afficher les stations, filtrer les résultats, calculer la proximité, sécuriser les comptes partenaires et améliorer la fiabilité des signalements.</Text></Section>
        <Section title="3. Conservation et partage"><Text>Les statuts et informations de station peuvent être conservés dans la base de l’application afin d’être visibles par la communauté. Les comptes partenaires sont désactivés à leur date d’expiration.</Text><Text>Essence Bénin ne vend pas les données personnelles. Les données peuvent être traitées par les prestataires techniques nécessaires à l’hébergement et au fonctionnement du service.</Text></Section>
        <Section title="4. Vos choix"><Text>Vous pouvez refuser l’accès à la localisation et continuer à utiliser la recherche et les filtres classiques. Vous pouvez demander la correction ou la suppression de vos données personnelles en écrivant à contact@essence-benin.bj.</Text></Section>
        <Section title="5. Limites"><Text>Les informations de disponibilité sont indicatives et peuvent changer après leur publication. L’application ne garantit ni la présence de carburant ni l’ouverture d’une station.</Text></Section>
        <View style={styles.notice}><Text style={styles.noticeTitle}>Mentions légales & contact</Text><Text style={styles.noticeText}>Service édité pour la mobilité au Bénin · Cotonou, République du Bénin · Contact : contact@essence-benin.bj. Pour toute demande d’accès gestionnaire ou rectification légale, adressez votre requête à cette adresse.</Text></View>
      </ScrollView>
    </ScreenContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.sectionCopy}>{children}</View></View>;
}

const styles = StyleSheet.create({
  content: { padding: 18, paddingBottom: 45 },
  back: { alignSelf: "flex-start", paddingVertical: 8 },
  backText: { color: "#0B6B5A", fontWeight: "800" },
  eyebrow: { color: "#8A9890", letterSpacing: 1.2, fontSize: 10, fontWeight: "900", marginTop: 12 },
  title: { color: "#10221D", fontSize: 27, lineHeight: 33, fontWeight: "900", marginTop: 5 },
  updated: { color: "#8A9890", fontSize: 11, marginTop: 8 },
  intro: { color: "#65756D", fontSize: 14, lineHeight: 21, marginTop: 14, marginBottom: 8 },
  section: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E2EBE5", borderRadius: 16, padding: 15, marginTop: 10 },
  sectionTitle: { color: "#1E342A", fontSize: 14, fontWeight: "900", marginBottom: 5 },
  sectionCopy: { gap: 8 },
  sectionText: {},
  notice: { backgroundColor: "#FFF7E7", borderRadius: 16, padding: 15, marginTop: 12 },
  noticeTitle: { color: "#9A6917", fontWeight: "900", fontSize: 13 },
  noticeText: { color: "#846F46", fontSize: 11, lineHeight: 17, marginTop: 5 },
  pressed: { opacity: 0.7 },
});
