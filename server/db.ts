import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import {
  InsertStation,
  InsertUser,
  Station,
  stationStatusUpdates,
  stations,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { OFFICIAL_BENIN_PETRO_STATIONS } from "./official-stations";
import { OFFICIAL_ORYX_STATIONS } from "./oryx-stations";

let _db: ReturnType<typeof drizzle> | null = null;
let seedPromise: Promise<void> | null = null;

function getPublicFallbackStations(): Station[] {
  const now = new Date();
  return [...OFFICIAL_BENIN_PETRO_STATIONS, ...OFFICIAL_ORYX_STATIONS].map((station, index) => ({
    ...station,
    id: index + 1,
    createdAt: now,
    updatedAt: now,
  })) as Station[];
}

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) {
    if (user[field] !== undefined) {
      const value = user[field] ?? null;
      values[field] = value;
      updateSet[field] = value;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  values.lastSignedIn ??= new Date();
  updateSet.lastSignedIn ??= new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export function hashPartnerPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

export function verifyPartnerPassword(password: string, encoded: string | null) {
  if (!encoded) return false;
  const [salt, expected] = encoded.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64);
  const target = Buffer.from(expected, "hex");
  return target.length === actual.length && timingSafeEqual(actual, target);
}

export async function createPartnerAccess(input: { stationId: number; email: string; password: string; expiresAt: Date }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const openId = `partner_${randomBytes(12).toString("hex")}`;
  await db.insert(users).values({
    openId,
    email: input.email.toLowerCase(),
    name: `Partenaire station ${input.stationId}`,
    loginMethod: "partner_password",
    role: "partner",
    stationId: input.stationId,
    passwordHash: hashPartnerPassword(input.password),
    accessExpiresAt: input.expiresAt,
  });
  return getUserByOpenId(openId);
}

async function seedStationsIfEmpty() {
  const db = await getDb();
  if (!db || OFFICIAL_BENIN_PETRO_STATIONS.length === 0) return;
  if (!seedPromise) {
    seedPromise = (async () => {
      const existing = await db.select({ sourceId: stations.sourceId }).from(stations);
      if (existing.length === 0) {
        await db.insert(stations).values(OFFICIAL_BENIN_PETRO_STATIONS);
        console.log(`[Stations] Seeded ${OFFICIAL_BENIN_PETRO_STATIONS.length} stations from Bénin Petro`);
      }
      const knownSources = new Set(existing.map((row) => row.sourceId));
      const missingOryx = OFFICIAL_ORYX_STATIONS.filter((station) => !knownSources.has(station.sourceId));
      if (missingOryx.length) {
        await db.insert(stations).values(missingOryx);
        console.log(`[Stations] Seeded ${missingOryx.length} stations from Oryx Energies`);
      }
    })().catch((error) => {
      seedPromise = null;
      console.error("[Stations] Seed failed:", error);
      throw error;
    });
  }
  await seedPromise;
}

export async function listStations() {
  const db = await getDb();
  if (!db) {
    console.warn("[Stations] Database unavailable; serving official fallback catalog");
    return getPublicFallbackStations();
  }
  try {
    await seedStationsIfEmpty();
    return await db
      .select()
      .from(stations)
      .where(eq(stations.active, 1))
      .orderBy(asc(stations.city), asc(stations.name));
  } catch (error) {
    console.warn("[Stations] Public query failed; serving official fallback catalog", error);
    return getPublicFallbackStations();
  }
}

export async function listAllStations() {
  const db = await getDb();
  if (!db) return [];
  await seedStationsIfEmpty();
  return db.select().from(stations).orderBy(asc(stations.city), asc(stations.name));
}

export async function getStation(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(stations).where(eq(stations.id, id)).limit(1);
  return result[0];
}

export async function createStation(data: InsertStation, actorUserId: number, note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(stations).values(data);
  const id = Number((result as unknown as { insertId: number }).insertId);
  if (data.essenceStatus || data.gasoilStatus) {
    const updates: (typeof stationStatusUpdates.$inferInsert)[] = [];
    if (data.essenceStatus) updates.push({ stationId: id, product: "essence", status: data.essenceStatus, source: "admin", actorUserId, note });
    if (data.gasoilStatus) updates.push({ stationId: id, product: "gasoil", status: data.gasoilStatus, source: "admin", actorUserId, note });
    if (updates.length) await db.insert(stationStatusUpdates).values(updates);
  }
  return getStation(id);
}

export async function updateStation(
  id: number,
  data: Partial<Pick<InsertStation, "name" | "city" | "address" | "phone" | "latitude" | "longitude" | "essenceStatus" | "gasoilStatus" | "confidence" | "sourceLabel" | "sourceUrl" | "active">>,
  actorUserId: number,
  note?: string,
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stations).set(data).where(eq(stations.id, id));

  const updates: (typeof stationStatusUpdates.$inferInsert)[] = [];
  if (data.essenceStatus) {
    updates.push({ stationId: id, product: "essence", status: data.essenceStatus, source: "admin", actorUserId, note });
  }
  if (data.gasoilStatus) {
    updates.push({ stationId: id, product: "gasoil", status: data.gasoilStatus, source: "admin", actorUserId, note });
  }
  if (updates.length) await db.insert(stationStatusUpdates).values(updates);
  return getStation(id);
}

export async function updatePartnerStationStatus(stationId: number, essenceStatus: "available" | "out" | "unknown", actorUserId: number, note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(stations).set({ essenceStatus, confidence: "partner", sourceUpdatedAt: new Date() }).where(eq(stations.id, stationId));
  await db.insert(stationStatusUpdates).values({ stationId, product: "essence", status: essenceStatus, source: "partner", actorUserId, note });
  return getStation(stationId);
}

export async function getStationHistory(id: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(stationStatusUpdates)
    .where(eq(stationStatusUpdates.stationId, id))
    .orderBy(desc(stationStatusUpdates.createdAt));
}
