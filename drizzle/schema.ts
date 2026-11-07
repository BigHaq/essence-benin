import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "partner"]).default("user").notNull(),
  stationId: int("stationId"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  accessExpiresAt: timestamp("accessExpiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const stations = mysqlTable("stations", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: varchar("sourceId", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  operator: varchar("operator", { length: 120 }).notNull().default("Bénin Petro"),
  city: varchar("city", { length: 120 }).notNull(),
  district: varchar("district", { length: 160 }),
  address: text("address"),
  phone: varchar("phone", { length: 40 }),
  latitude: varchar("latitude", { length: 32 }).notNull(),
  longitude: varchar("longitude", { length: 32 }).notNull(),
  essenceStatus: mysqlEnum("essenceStatus", ["available", "out", "unknown"]).notNull().default("unknown"),
  gasoilStatus: mysqlEnum("gasoilStatus", ["available", "out", "unknown"]).notNull().default("unknown"),
  confidence: mysqlEnum("confidence", ["official", "partner", "user", "stale"]).notNull().default("official"),
  sourceLabel: varchar("sourceLabel", { length: 255 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 500 }),
  sourceUpdatedAt: timestamp("sourceUpdatedAt"),
  active: int("active").notNull().default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const stationStatusUpdates = mysqlTable("stationStatusUpdates", {
  id: int("id").autoincrement().primaryKey(),
  stationId: int("stationId").notNull(),
  product: mysqlEnum("product", ["essence", "gasoil"]).notNull(),
  status: mysqlEnum("status", ["available", "out", "unknown"]).notNull(),
  source: mysqlEnum("source", ["admin", "partner", "user", "official_api"]).notNull(),
  note: text("note"),
  actorUserId: int("actorUserId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Station = typeof stations.$inferSelect;
export type InsertStation = typeof stations.$inferInsert;
export type StationStatusUpdate = typeof stationStatusUpdates.$inferSelect;
export type InsertStationStatusUpdate = typeof stationStatusUpdates.$inferInsert;
