import { describe, expect, it } from "vitest";

import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";
import { hashPartnerPassword, verifyPartnerPassword } from "../server/db";
import type { User } from "../drizzle/schema";

const user: User = {
  id: 8,
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

function contextFor(currentUser: User): TrpcContext {
  return { user: currentUser, req: { protocol: "https", headers: {} } as TrpcContext["req"], res: {} as TrpcContext["res"] };
}

describe("accès station partenaire", () => {
  it("vérifie les mots de passe sans les stocker en clair", () => {
    const encoded = hashPartnerPassword("mot-de-passe-long");
    expect(encoded).not.toContain("mot-de-passe-long");
    expect(verifyPartnerPassword("mot-de-passe-long", encoded)).toBe(true);
    expect(verifyPartnerPassword("mauvais-mot-de-passe", encoded)).toBe(false);
  });

  it("refuse la mise à jour partenaire à un utilisateur classique", async () => {
    const caller = appRouter.createCaller(contextFor(user));
    await expect(caller.stations.partnerUpdateStatus({ essenceStatus: "available" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("refuse la mise à jour à un partenaire dont l'accès est expiré", async () => {
    const expiredPartner: User = {
      ...user,
      role: "partner",
      stationId: 1,
      accessExpiresAt: new Date(Date.now() - 60_000),
    };
    const caller = appRouter.createCaller(contextFor(expiredPartner));
    await expect(caller.stations.partnerUpdateStatus({ essenceStatus: "available" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});
