import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

import { trpc } from "@/lib/trpc";
import { type Station, type StationStatus } from "@/lib/stations";

const OVERRIDES_KEY = "stations-essence-benin.status-overrides";
type StatusOverrides = Record<string, StationStatus>;

type StationsContextValue = {
  stations: Station[];
  updateStatus: (stationId: string, status: StationStatus) => void;
  overrideCount: number;
  isHydrated: boolean;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
};

const StationsContext = createContext<StationsContextValue | null>(null);

function formatUpdatedAt(value: unknown) {
  if (!value) return "Date non communiquée";
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Date non communiquée";
  return `Vérifié le ${date.toLocaleDateString("fr-FR")}`;
}

export function StationsProvider({ children }: { children: React.ReactNode }) {
  const remote = trpc.stations.list.useQuery(undefined, { staleTime: 60_000 });
  const [overrides, setOverrides] = useState<StatusOverrides>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(OVERRIDES_KEY)
      .then((raw) => {
        if (!active || !raw) return;
        try {
          setOverrides(JSON.parse(raw) as StatusOverrides);
        } catch {
          setOverrides({});
        }
      })
      .finally(() => {
        if (active) setIsHydrated(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const stations = useMemo<Station[]>(() => {
    const rows = remote.data ?? [];
    return rows.map((station) => {
      const id = String(station.id);
      const status = overrides[id] ?? station.essenceStatus;
      return {
        id,
        name: station.name,
        operator: station.operator,
        city: station.city,
        district: station.district ?? "Bénin",
        address: station.address ?? "Adresse à confirmer",
        latitude: Number(station.latitude),
        longitude: Number(station.longitude),
        status,
        statusUpdatedAt: formatUpdatedAt(station.sourceUpdatedAt),
        source: overrides[id] ? "Signalement local" : station.sourceLabel,
      };
    });
  }, [remote.data, overrides]);

  const updateStatus = (stationId: string, status: StationStatus) => {
    setOverrides((current) => {
      const next = { ...current, [stationId]: status };
      void AsyncStorage.setItem(OVERRIDES_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      stations,
      updateStatus,
      overrideCount: Object.keys(overrides).length,
      isHydrated,
      isLoading: remote.isLoading,
      error: remote.error instanceof Error ? remote.error : null,
      refresh: () => void remote.refetch(),
    }),
    [stations, overrides, isHydrated, remote],
  );

  return <StationsContext.Provider value={value}>{children}</StationsContext.Provider>;
}

export function useStations() {
  const value = useContext(StationsContext);
  if (!value) throw new Error("useStations doit être utilisé dans StationsProvider");
  return value;
}
