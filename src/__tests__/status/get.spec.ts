import { describe, expect, it, beforeAll } from "vitest";

import orchestrator from "../../__tests__/orchestrator";

interface StatusResponse {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET /api/v1/status", () => {
  describe("Anonymous user", () => {
    it("Retrieving current system status", async () => {
      const response: Response = await fetch(
        "http://localhost:3000/api/v1/status"
      );
      expect(response.status).toBe(200);

      const responseBody = (await response.json()) as StatusResponse;

      const parsedUpdateAt = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedUpdateAt);

      expect(responseBody.dependencies.database.version).toEqual("9.3.0");
      expect(responseBody.dependencies.database.max_connections).toEqual(151);
      expect(responseBody.dependencies.database.opened_connections).toEqual(1);
    });
  });
});
