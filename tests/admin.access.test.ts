import { describe, expect, it } from "vitest";

import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";
import type { User } from "../drizzle/schema";

function contextFor(user: User | null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const regularUser: User = {
  id: 7,
  openId: "regular-user",
  name: "Utilisateur",
  email: "user@example.com",
  loginMethod: "manus",
  role: "user",
  stationId: null,
  passwordHash: null,
  accessExpiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("protection de l’espace administrateur", () => {
  it("refuse la liste admin à un visiteur non connecté", async () => {
    const caller = appRouter.createCaller(contextFor(null));
    await expect(caller.stations.adminList()).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("refuse la modification à un utilisateur sans rôle admin", async () => {
    const caller = appRouter.createCaller(contextFor(regularUser));
    await expect(
      caller.stations.update({ id: 1, essenceStatus: "available" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("refuse la création à un utilisateur sans rôle admin", async () => {
    const caller = appRouter.createCaller(contextFor(regularUser));
    await expect(
      caller.stations.create({
        sourceId: "test-unauthorized",
        name: "Station non autorisée",
        city: "Cotonou",
        latitude: "6.37",
        longitude: "2.42",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
