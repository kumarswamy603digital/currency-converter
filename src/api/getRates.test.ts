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

  it("throws when Frankfurter fails and fallback is non-ok", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 503 } as any)
      .mockResolvedValueOnce({ ok: false, status: 503 } as any);
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

  it("uses CDN fallback when Frankfurter network fails", async () => {
    const fallbackPayload = {
      date: "2026-01-01",
      usd: { eur: 2 },
    };
    const json = vi.fn().mockResolvedValue(fallbackPayload);
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("offline"))
      .mockResolvedValueOnce({ ok: true, json } as any);

    const res = await getRates(10, "USD", "EUR");
    expect(res).toEqual({
      amount: 10,
      base: "USD",
      rates: { EUR: 20 },
    });
  });

  it("propagates fetch rejection when fallback also fails", async () => {
    const err = new Error("offline");
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(err)
      .mockRejectedValueOnce(err);
    await expect(getRates(2, "USD", "EUR")).rejects.toBe(err);
  });
});
