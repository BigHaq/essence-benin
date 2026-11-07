import { describe, expect, it } from "vitest";

import { getStatusLabel, INITIAL_STATIONS, type StationStatus } from "../lib/stations";
import { OFFICIAL_BENIN_PETRO_STATIONS } from "../server/official-stations";
import { OFFICIAL_ORYX_STATIONS } from "../server/oryx-stations";

describe("catalogue des stations Essence Bénin", () => {
  it("contient un catalogue initial non vide avec des identifiants uniques", () => {
    expect(INITIAL_STATIONS.length).toBeGreaterThan(0);
    expect(new Set(INITIAL_STATIONS.map((station) => station.id)).size).toBe(INITIAL_STATIONS.length);
  });

  it("répartit chaque station dans un statut reconnu", () => {
    const statuses: StationStatus[] = ["available", "out", "unknown"];
    expect(INITIAL_STATIONS.every((station) => statuses.includes(station.status))).toBe(true);
    expect(INITIAL_STATIONS.some((station) => station.status === "available")).toBe(true);
    expect(INITIAL_STATIONS.some((station) => station.status === "out")).toBe(true);
    expect(INITIAL_STATIONS.some((station) => station.status === "unknown")).toBe(true);
  });

  it("expose des libellés explicites pour les trois statuts", () => {
    expect(getStatusLabel("available")).toBe("Essence disponible");
    expect(getStatusLabel("out")).toBe("Rupture signalée");
    expect(getStatusLabel("unknown")).toBe("À vérifier");
  });

  it("garde les coordonnées dans la zone géographique du Bénin", () => {
    expect(INITIAL_STATIONS.every((station) => station.latitude >= 6 && station.latitude <= 13)).toBe(true);
    expect(INITIAL_STATIONS.every((station) => station.longitude >= 1 && station.longitude <= 4)).toBe(true);
  });

  it("embarque le snapshot public Bénin Petro sans doublon", () => {
    expect(OFFICIAL_BENIN_PETRO_STATIONS).toHaveLength(91);
    expect(new Set(OFFICIAL_BENIN_PETRO_STATIONS.map((station) => station.sourceId)).size).toBe(91);
    expect(OFFICIAL_BENIN_PETRO_STATIONS.every((station) => station.sourceUrl?.includes("beninpetro.com"))).toBe(true);
  });

  it("conserve la distinction essence disponible / rupture du snapshot", () => {
    expect(OFFICIAL_BENIN_PETRO_STATIONS.filter((station) => station.essenceStatus === "available")).toHaveLength(16);
    expect(OFFICIAL_BENIN_PETRO_STATIONS.filter((station) => station.essenceStatus === "out")).toHaveLength(75);
    expect(OFFICIAL_BENIN_PETRO_STATIONS.every((station) => Number(station.latitude) >= 6 && Number(station.latitude) <= 13)).toBe(true);
  });

  it("importe les 44 implantations Oryx avec GPS et sans stock inventé", () => {
    expect(OFFICIAL_ORYX_STATIONS).toHaveLength(44);
    expect(new Set(OFFICIAL_ORYX_STATIONS.map((station) => station.sourceId)).size).toBe(44);
    expect(OFFICIAL_ORYX_STATIONS.every((station) => station.essenceStatus === "unknown")).toBe(true);
    expect(OFFICIAL_ORYX_STATIONS.every((station) => Number.isFinite(Number(station.latitude)) && Number.isFinite(Number(station.longitude)))).toBe(true);
    expect(OFFICIAL_ORYX_STATIONS.every((station) => station.sourceUrl?.includes("oryxenergies.com"))).toBe(true);
  });
});
