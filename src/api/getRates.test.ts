import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRates } from "./getRates";

const originalFetch = globalThis.fetch;

describe("getRates", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch as any;
  });

  it("builds URL and returns parsed data", async () => {
    const payload = { amount: 5, base: "USD", rates: { EUR: 4.5 } };
    const json = vi.fn().mockResolvedValue(payload);
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json } as any);

    const res = await getRates(5, "USD", "EUR");
    expect(res).toEqual(payload);
    const calledUrl = (globalThis.fetch as any).mock.calls[0][0] as string;
    expect(calledUrl).toContain("amount=5");
    expect(calledUrl).toContain("from=USD");
    expect(calledUrl).toContain("to=EUR");
  });

  it("throws with status code on error", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: false, status: 503 } as any);
    await expect(getRates(1, "USD", "EUR")).rejects.toThrow(
      "Frankfurter error: 503"
    );
  });

  it("supports decimal amount and encodes params", async () => {
    const payload = { amount: 1.25, base: "GBP", rates: { JPY: 200.55 } };
    const json = vi.fn().mockResolvedValue(payload);
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: true, json } as any);

    await getRates(1.25, "GBP", "JPY");
    const calledUrl = (globalThis.fetch as any).mock.calls[0][0] as string;
    const u = new URL(calledUrl);
    expect(u.searchParams.get("amount")).toBe("1.25");
    expect(u.searchParams.get("from")).toBe("GBP");
    expect(u.searchParams.get("to")).toBe("JPY");
  });

  it("propagates fetch rejection", async () => {
    const err = new Error("offline");
    globalThis.fetch = vi.fn().mockRejectedValue(err);
    await expect(getRates(2, "USD", "EUR")).rejects.toBe(err);
  });
});
