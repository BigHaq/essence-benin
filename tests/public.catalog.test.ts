import { describe, expect, it } from "vitest";

import { appRouter } from "../server/routers";
import type { TrpcContext } from "../server/_core/context";

const publicContext: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("catalogue public", () => {
  it("ne renvoie jamais un catalogue vide lorsque la base distante est indisponible", async () => {
    const stations = await appRouter.createCaller(publicContext).stations.list();
    expect(stations.length).toBeGreaterThanOrEqual(135);
    expect(stations.some((station) => station.operator === "Oryx Energies")).toBe(true);
    expect(stations.some((station) => station.operator === "Bénin Petro")).toBe(true);
  });
});
