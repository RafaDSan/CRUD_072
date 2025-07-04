import { describe, expect, it, beforeAll } from "vitest";
import orchestrator from "../../__tests__/orchestrator";

interface ErrorResponse {
  name: string;
  message: string;
  action: string;
  status_code: number;
}

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("Invalid HTTP methods for /api/v1/status", () => {
  describe("Anonymous user", () => {
    const invalidMethods = ["POST", "PUT", "DELETE", "PATCH"];

    invalidMethods.forEach((method) => {
      it(`Should not allow ${method} method`, async () => {
        const response: Response = await fetch(
          "http://localhost:3000/api/v1/status",
          {
            method: method,
          }
        );

        expect(response.status).toBe(405);

        const responseBody = (await response.json()) as ErrorResponse;

        expect(responseBody.name).toBe("MethodNotAllowedError");
        expect(responseBody.message).toBe(
          "Método não permitido para este endpoint."
        );
        expect(responseBody.action).toBe(
          "Verifique se o método HTTP enviado é válido para este endpoint."
        );
        expect(responseBody.status_code).toBe(405);
      });
    });
  });
});
