/**
 * Unified type exports and validation schemas shared by server and client.
 */

import { z } from "zod";

export type * from "../drizzle/schema";
export * from "./_core/errors";

export const stationStatusSchema = z.enum(["available", "out", "unknown"]);
export type StationStatus = z.infer<typeof stationStatusSchema>;
