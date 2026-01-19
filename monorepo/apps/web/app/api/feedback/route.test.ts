import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";
import * as apiUtils from "@lib/api-utils";
import * as feedbackValidations from "@lib/validations/feedback";

const vi_mockFeedbackService = {
  create: vi.fn(),
};

vi.mock("@lib/deps", () => ({
  getFeedbackDeps: () => ({ feedbackService: vi_mockFeedbackService }),
}));

vi.mock("@lib/api-utils", () => ({
  validateUserOrKey: vi.fn(),
}));

vi.mock("@lib/validations/feedback", () => ({
  validateFeedbackBody: vi.fn(),
}));

vi.mock("@lib/api-error-handler", async (importOriginal) => {
  return await importOriginal<typeof import("@lib/api-error-handler")>();
});

describe("Feedback API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validPayload = {
    projectId: "proj_123",
    userId: "00000000-0000-0000-0000-000000000000",
    rating: 5,
    comment: "Excellent",
    timestamp: new Date().toISOString(),
    context: { url: "/home", userAgent: "Mozilla/5.0" },
  };

  it("POST: debe crear un feedback exitosamente", async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue("user_test_123");
    vi.mocked(feedbackValidations.validateFeedbackBody).mockResolvedValue(validPayload);
    vi_mockFeedbackService.create.mockResolvedValue({ id: "fb_1" });

    const req = new NextRequest("http://localhost/api/feedback", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(req);
    const json = (await response.json()) as {
      success: boolean;
      data: { id: string };
    };

    expect(response.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.id).toBe("fb_1");
  });

  it("POST: debe retornar 400 si el JSON es inválido", async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue("user_test_123");
    vi.mocked(feedbackValidations.validateFeedbackBody).mockRejectedValue(new SyntaxError());

    const req = new NextRequest("http://localhost/api/feedback", {
      method: "POST",
      body: "invalid-json",
    });

    const response = await POST(req);
    const json = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Invalid JSON format");
  });

  it("POST: debe retornar 500 ante un error inesperado del sistema", async () => {
    vi.mocked(apiUtils.validateUserOrKey).mockResolvedValue("user_test_123");
    vi.mocked(feedbackValidations.validateFeedbackBody).mockResolvedValue(validPayload);

    vi_mockFeedbackService.create.mockRejectedValue(
      new Error("Unexpected Database Crash"),
    );

    const req = new NextRequest("http://localhost/api/feedback", {
      method: "POST",
      body: JSON.stringify(validPayload),
    });

    const response = await POST(req);
    const json = (await response.json()) as { success: boolean; error: string };

    expect(response.status).toBe(500);
    expect(json.success).toBe(false);
    expect(json.error).toBe("Internal Server Error");
  });
});