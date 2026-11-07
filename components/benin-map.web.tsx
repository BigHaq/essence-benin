import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import type { Station } from "@/lib/stations";

type LeafletModule = typeof import("react-leaflet");
const BENIN_BOUNDS: [[number, number], [number, number]] = [[6.15, 1.05], [12.5, 3.85]];

export function BeninMap({ stations, onSelect }: { stations: Station[]; onSelect: (station: Station) => void }) {
  const [leaflet, setLeaflet] = useState<LeafletModule | null>(null);

  useEffect(() => {
    let active = true;
    void import("react-leaflet").then((module) => {
      if (active) setLeaflet(module);
    });
    return () => { active = false; };
  }, []);

  if (!leaflet) return <div style={{ height: 420, borderRadius: 16, backgroundColor: "#EAF5EF", display: "flex", alignItems: "center", justifyContent: "center", color: "#5E7D70", fontSize: 12 }}>Chargement de la carte complète…</div>;

  const { MapContainer, TileLayer, CircleMarker, useMap } = leaflet;
  function FitStations() {
    const map = useMap();
    useEffect(() => {
      if (stations.length > 0) map.fitBounds(BENIN_BOUNDS, { padding: [18, 18] });
    }, [map]);
    return null;
  }

  return (
    <div style={{ height: 420, width: "100%", borderRadius: 16, overflow: "hidden", position: "relative" }}>
      <MapContainer center={[9.3, 2.3]} zoom={7} minZoom={6} maxZoom={17} maxBounds={BENIN_BOUNDS} maxBoundsViscosity={0.85} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitStations />
        {stations.map((station) => {
          const color = station.status === "available" ? "#17805F" : station.status === "out" ? "#C2413B" : "#B7791F";
          return <CircleMarker key={station.id} center={[station.latitude, station.longitude]} radius={7} pathOptions={{ color: "#FFFFFF", weight: 2, fillColor: color, fillOpacity: 0.95 }} eventHandlers={{ click: () => onSelect(station) }} />;
        })}
      </MapContainer>
      <div style={{ position: "absolute", left: 12, bottom: 12, zIndex: 500, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 10, padding: "7px 10px", fontSize: 11, color: "#56665E", boxShadow: "0 2px 8px rgba(20,60,40,.12)" }}>Cliquez sur un marqueur pour ouvrir la station</div>
    </div>
  );
}
