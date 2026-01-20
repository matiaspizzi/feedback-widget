/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FeedbackSDK } from "./feedback-sdk";

describe("FeedbackSDK", () => {
  const mockConfig = {
    projectId: "proj_123",
    apiKey: "test-key",
    apiUrl: "http://localhost:3000",
    debug: false,
  };

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();

    // @ts-expect-error
    FeedbackSDK.instance = undefined;

    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("must generate and persist a unique userId in localStorage", () => {
    const sdk = FeedbackSDK.getInstance();
    // @ts-expect-error
    const id1 = sdk.userId;

    expect(id1).toBeDefined();
    expect(localStorage.getItem("fb_sdk_user_id")).toBe(id1);

    // @ts-expect-error
    FeedbackSDK.instance = undefined;
    const sdk2 = FeedbackSDK.getInstance();
    // @ts-expect-error
    expect(sdk2.userId).toBe(id1);
  });

  it("init() must inject the feedback-widget component into the DOM", () => {
    const sdk = FeedbackSDK.getInstance();
    sdk.init(mockConfig);

    const widget = document.querySelector("feedback-widget");
    expect(widget).not.toBeNull();
    expect(document.body.contains(widget)).toBe(true);
  });

  it("destroy() must remove the widget and clear the configuration", () => {
    const sdk = FeedbackSDK.getInstance();
    sdk.init(mockConfig);
    sdk.destroy();

    expect(document.querySelector("feedback-widget")).toBeNull();
    // @ts-expect-error
    expect(sdk.config).toBeNull();
  });

  it("submitFeedback must send the correct data through fetch", async () => {
    const sdk = FeedbackSDK.getInstance();
    sdk.init(mockConfig);

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ success: true }),
    };
    vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response);

    await sdk.submitFeedback(5, "Excelente servicio");

    expect(global.fetch).toHaveBeenCalledWith(
      `${mockConfig.apiUrl}/api/feedback`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": mockConfig.apiKey,
        },
      }),
    );

    const callBody = JSON.parse(
      vi.mocked(global.fetch).mock.calls[0][1]?.body as string,
    );
    expect(callBody.rating).toBe(5);
    expect(callBody.comment).toBe("Excelente servicio");
    expect(callBody.projectId).toBe(mockConfig.projectId);
  });

  it("must apply rate limiting (throttle) of 5 seconds", async () => {
    const sdk = FeedbackSDK.getInstance();
    sdk.init(mockConfig);

    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ success: true }),
    };
    vi.mocked(global.fetch).mockResolvedValue(mockResponse as Response);

    await sdk.submitFeedback(5);

    await expect(sdk.submitFeedback(4)).rejects.toThrow(
      "Please wait before sending more feedback.",
    );

    vi.advanceTimersByTime(6000);

    await sdk.submitFeedback(4);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it("must fail if feedback is submitted without initializing the SDK", async () => {
    const sdk = FeedbackSDK.getInstance();
    await expect(sdk.submitFeedback(5)).rejects.toThrow(
      "SDK not initialized. Call init() first.",
    );
  });

  it("must handle server errors", async () => {
    const sdk = FeedbackSDK.getInstance();
    sdk.init(mockConfig);

    const mockErrorResponse = {
      ok: false,
      statusText: "Internal Server Error",
      json: () => Promise.resolve({ error: "Server exploded" }),
    };
    vi.mocked(global.fetch).mockResolvedValue(mockErrorResponse as Response);

    await expect(sdk.submitFeedback(5)).rejects.toThrow(
      "Server error: Internal Server Error",
    );
  });
});
