export type StationStatus = "available" | "out" | "unknown";

export type Station = {
  id: string;
  name: string;
  operator: string;
  city: string;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  status: StationStatus;
  statusUpdatedAt: string;
  source: string;
};

export const STATUS_LABELS: Record<StationStatus, string> = {
  available: "Essence disponible",
  out: "Rupture signalée",
  unknown: "À vérifier",
};

export const STATUS_COLORS: Record<StationStatus, string> = {
  available: "#17805f",
  out: "#c2413b",
  unknown: "#b7791f",
};

/**
 * Catalogue de démonstration couvrant les principaux axes urbains du Bénin.
 * Chaque statut doit être confirmé sur le terrain avant d'être considéré comme fiable.
 */
export const INITIAL_STATIONS: Station[] = [
  { id: "cot-port", name: "Station Cotonou Port", operator: "JNP", city: "Cotonou", district: "Zongo", address: "Boulevard de la Marina", latitude: 6.3558, longitude: 2.4256, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "cot-st-michel", name: "Station Saint-Michel", operator: "TotalEnergies", city: "Cotonou", district: "Saint-Michel", address: "Avenue Steinmetz", latitude: 6.3654, longitude: 2.4337, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "cot-akpakpa", name: "Station Akpakpa", operator: "SONACOP", city: "Cotonou", district: "Akpakpa", address: "Route de Porto-Novo", latitude: 6.3679, longitude: 2.4664, status: "unknown", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "cot-fidjrosse", name: "Station Fidjrossè", operator: "JNP", city: "Cotonou", district: "Fidjrossè", address: "Route des Pêches", latitude: 6.3493, longitude: 2.3715, status: "out", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "calavi-cite", name: "Station Cité Vie Nouvelle", operator: "TotalEnergies", city: "Abomey-Calavi", district: "Godomey", address: "RNIE 1, Godomey", latitude: 6.4136, longitude: 2.3547, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "calavi-zogbadje", name: "Station Zogbadjè", operator: "JNP", city: "Abomey-Calavi", district: "Zogbadjè", address: "Carrefour Zogbadjè", latitude: 6.4498, longitude: 2.3551, status: "unknown", statusUpdatedAt: "Il y a 2 j", source: "Base initiale à confirmer" },
  { id: "porto-ouando", name: "Station Ouando", operator: "SONACOP", city: "Porto-Novo", district: "Ouando", address: "Boulevard extérieur", latitude: 6.4969, longitude: 2.6289, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "porto-avakpa", name: "Station Avakpa", operator: "JNP", city: "Porto-Novo", district: "Avakpa", address: "Avenue Jean Bayol", latitude: 6.5012, longitude: 2.6059, status: "out", statusUpdatedAt: "Il y a 3 h", source: "Base initiale à confirmer" },
  { id: "seme-kpodji", name: "Station Sèmè-Kpodji", operator: "TotalEnergies", city: "Sèmè-Kpodji", district: "Sèmè", address: "RNIE 1, entrée de ville", latitude: 6.3829, longitude: 2.6152, status: "unknown", statusUpdatedAt: "Il y a 3 j", source: "Base initiale à confirmer" },
  { id: "ouidah-centre", name: "Station Ouidah Centre", operator: "JNP", city: "Ouidah", district: "Centre", address: "RNIE 1, quartier Zomaï", latitude: 6.3632, longitude: 2.0851, status: "available", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "come-route", name: "Station Comè Route Nationale", operator: "SONACOP", city: "Comè", district: "Centre", address: "RNIE 1, sortie nord", latitude: 6.4079, longitude: 1.8847, status: "unknown", statusUpdatedAt: "Il y a 4 j", source: "Base initiale à confirmer" },
  { id: "lokossa-marche", name: "Station Lokossa Marché", operator: "JNP", city: "Lokossa", district: "Marché", address: "Avenue de la République", latitude: 6.6387, longitude: 1.7167, status: "out", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "bohicon-gare", name: "Station Bohicon Gare", operator: "TotalEnergies", city: "Bohicon", district: "Gare", address: "RNIE 2, quartier Gare", latitude: 7.1783, longitude: 2.0667, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "abomey-zongo", name: "Station Abomey Zongo", operator: "JNP", city: "Abomey", district: "Zongo", address: "Route d'Agbangnizoun", latitude: 7.1856, longitude: 1.9912, status: "unknown", statusUpdatedAt: "Il y a 2 j", source: "Base initiale à confirmer" },
  { id: "dassa-centre", name: "Station Dassa Centre", operator: "SONACOP", city: "Dassa-Zoumè", district: "Centre", address: "RNIE 2, quartier central", latitude: 7.7526, longitude: 2.1833, status: "available", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "savè-route", name: "Station Savè Route", operator: "JNP", city: "Savè", district: "Centre", address: "RNIE 2, sortie nord", latitude: 8.0342, longitude: 2.4867, status: "unknown", statusUpdatedAt: "Il y a 3 j", source: "Base initiale à confirmer" },
  { id: "parakou-trikp", name: "Station Parakou Trikké", operator: "TotalEnergies", city: "Parakou", district: "Trikké", address: "RNIE 2, axe sud", latitude: 9.3372, longitude: 2.6303, status: "available", statusUpdatedAt: "Aujourd’hui", source: "Base initiale à confirmer" },
  { id: "parakou-banikanni", name: "Station Banikanni", operator: "JNP", city: "Parakou", district: "Banikanni", address: "Boulevard de l'Université", latitude: 9.3651, longitude: 2.6169, status: "out", statusUpdatedAt: "Il y a 5 h", source: "Base initiale à confirmer" },
  { id: "djougou-centre", name: "Station Djougou Centre", operator: "SONACOP", city: "Djougou", district: "Centre", address: "RNIE 6, entrée sud", latitude: 9.7085, longitude: 1.6659, status: "unknown", statusUpdatedAt: "Il y a 4 j", source: "Base initiale à confirmer" },
  { id: "natitingou-ota", name: "Station Natitingou Ouest", operator: "JNP", city: "Natitingou", district: "Ourbouga", address: "RNIE 2, axe de Tanguiéta", latitude: 10.3046, longitude: 1.3796, status: "available", statusUpdatedAt: "Hier", source: "Base initiale à confirmer" },
  { id: "kandi-centre", name: "Station Kandi Centre", operator: "TotalEnergies", city: "Kandi", district: "Centre", address: "RNIE 2, centre-ville", latitude: 11.1342, longitude: 2.9387, status: "unknown", statusUpdatedAt: "Il y a 5 j", source: "Base initiale à confirmer" },
  { id: "malanville-frontiere", name: "Station Malanville Frontière", operator: "JNP", city: "Malanville", district: "Frontière", address: "Axe inter-États", latitude: 11.8686, longitude: 3.3833, status: "out", statusUpdatedAt: "Il y a 2 j", source: "Base initiale à confirmer" },
];

export function getStatusLabel(status: StationStatus) {
  return STATUS_LABELS[status];
}
