import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { adminProcedure, partnerProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { z } from "zod";

const stationStatusSchema = z.enum(["available", "out", "unknown"]);

const stationUpdateSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(2).max(255).optional(),
  city: z.string().min(2).max(120).optional(),
  address: z.string().max(1000).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/).optional(),
  essenceStatus: stationStatusSchema.optional(),
  gasoilStatus: stationStatusSchema.optional(),
  confidence: z.enum(["official", "partner", "user", "stale"]).optional(),
  sourceLabel: z.string().min(2).max(255).optional(),
  sourceUrl: z.string().url().nullable().optional(),
  active: z.number().int().min(0).max(1).optional(),
  note: z.string().max(1000).optional(),
});

const stationCreateSchema = z.object({
  sourceId: z.string().min(2).max(64),
  name: z.string().min(2).max(255),
  operator: z.string().min(2).max(120).default("À confirmer"),
  city: z.string().min(2).max(120),
  address: z.string().max(1000).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  latitude: z.string().regex(/^-?\d+(\.\d+)?$/),
  longitude: z.string().regex(/^-?\d+(\.\d+)?$/),
  essenceStatus: stationStatusSchema.default("unknown"),
  gasoilStatus: stationStatusSchema.default("unknown"),
  confidence: z.enum(["official", "partner", "user", "stale"]).default("partner"),
  sourceLabel: z.string().min(2).max(255).default("Ajout manuel administrateur"),
  sourceUrl: z.string().url().nullable().optional(),
  note: z.string().max(1000).optional(),
});

export const appRouter = router({
  system: router({
    health: publicProcedure.query(() => ({ status: "ok" as const })),
  }),
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  stations: router({
    list: publicProcedure.query(() => db.listStations()),
    adminList: adminProcedure.query(() => db.listAllStations()),
    create: adminProcedure.input(stationCreateSchema).mutation(({ ctx, input }) => {
      const { note, ...data } = input;
      return db.createStation({ ...data, active: 1, sourceUpdatedAt: new Date() }, ctx.user.id, note);
    }),
    update: adminProcedure.input(stationUpdateSchema).mutation(({ ctx, input }) => {
      const { id, note, ...data } = input;
      return db.updateStation(id, data, ctx.user.id, note);
    }),
    history: adminProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => {
      return db.getStationHistory(input.id);
    }),
    createPartnerAccess: adminProcedure.input(z.object({
      stationId: z.number().int().positive(),
      email: z.string().email(),
      password: z.string().min(10).max(128),
      durationMinutes: z.number().int().min(5).max(60 * 24 * 30).default(60),
    })).mutation(({ input }) => db.createPartnerAccess({
      stationId: input.stationId,
      email: input.email,
      password: input.password,
      expiresAt: new Date(Date.now() + input.durationMinutes * 60_000),
    })),
    partnerMe: partnerProcedure.query(({ ctx }) => db.getStation(ctx.user.stationId!)),
    partnerUpdateStatus: partnerProcedure.input(z.object({
      essenceStatus: stationStatusSchema,
      note: z.string().max(500).optional(),
    })).mutation(({ ctx, input }) => db.updatePartnerStationStatus(ctx.user.stationId!, input.essenceStatus, ctx.user.id, input.note)),
  }),
});

export type AppRouter = typeof appRouter;
