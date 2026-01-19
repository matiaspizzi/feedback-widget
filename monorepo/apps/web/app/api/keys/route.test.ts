import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import * as apiUtils from "@lib/api-utils";
import { BadRequestError } from "@lib/errors";

const vi_mockApiKeyService = {
  create: vi.fn(),
};

vi.mock("@lib/deps", () => ({
  getApiKeyDeps: () => ({ apiKeyService: vi_mockApiKeyService }),
}));

vi.mock("@lib/api-utils", () => ({
  validateUserOrKey: vi.fn(),
  validateSchema: vi.fn(),
}));

vi.mock("@lib/api-error-handler", async (importOriginal) => {
  return await importOriginal<typeof import("@lib/api-error-handler")>();
});

describe("Keys Root API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const userId = "user_123";

  it("POST: debe crear una llave con expiresAt correctamente parseado", async () => {
    const futureDate = "2028-01-01T00:00:00.000Z";
    const payload = { name: "Prod_Key", expiresAt: futureDate };

    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi.mocked(apiUtils.validateSchema).mockResolvedValue(payload);
    vi_mockApiKeyService.create.mockResolvedValue({
      id: "k1",
      name: payload.name,
      expiresAt: new Date(futureDate),
    });

    const req = new NextRequest("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(vi_mockApiKeyService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        expiresAt: expect.any(Date),
      }),
    );
  });

  it("POST: debe fallar si el nombre es inválido", async () => {
    const payload = { name: "$ %" };
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi.mocked(apiUtils.validateSchema).mockImplementation(async () => {
      throw new BadRequestError("Invalid payload", {
        name: ["Name can only contain letters, numbers, hyphens and underscores"]
      });
    });
    const req = new NextRequest("http://localhost/api/keys", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid payload");
    expect(json.details.name[0]).toBe(
      "Name can only contain letters, numbers, hyphens and underscores"
    );
  });

  it("POST: debe fallar si el JSON es malformado", async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue(userId);
    vi.mocked(apiUtils.validateSchema).mockRejectedValue(new SyntaxError("Unexpected token i in JSON"));
    const req = new NextRequest("http://localhost/api/keys", {
      method: "POST",
      body: "invalid-json",
    });

    const response = await POST(req);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.error).toBe("Invalid JSON format");
  });
});