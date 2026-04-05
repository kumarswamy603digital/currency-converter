import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchCurrencies } from "./fetchCurrencies";

const originalFetch = globalThis.fetch;

describe("fetchCurrencies", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch as any;
  });

  it("returns currencies on success", async () => {
    const mockJson = vi
      .fn()
      .mockResolvedValue({ USD: "United States Dollar", EUR: "Euro" });
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: mockJson } as any);

    const result = await fetchCurrencies();
    expect(result).toEqual({ USD: "United States Dollar", EUR: "Euro" });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.frankfurter.app/currencies",
      { signal: undefined }
    );
  });

  it("throws when Frankfurter and fallback both return non-ok", async () => {
    globalThis.fetch = vi
      .fn()
      .mockResolvedValueOnce({ ok: false } as any)
      .mockResolvedValueOnce({ ok: false } as any);
    await expect(fetchCurrencies()).rejects.toThrow(
      "Failed to load currencies"
    );
  });

  it("passes through AbortSignal", async () => {
    const controller = new AbortController();
    const mockJson = vi.fn().mockResolvedValue({});
    globalThis.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: mockJson } as any);
    await fetchCurrencies(controller.signal);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.frankfurter.app/currencies",
      { signal: controller.signal }
    );
  });

  it("uses CDN fallback when Frankfurter fails", async () => {
    const fallbackData = { usd: "US Dollar", eur: "Euro" };
    const mockJson = vi.fn().mockResolvedValue(fallbackData);
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce({ ok: true, json: mockJson } as any);

    const result = await fetchCurrencies();
    expect(result).toEqual({ USD: "US Dollar", EUR: "Euro" });
    expect((globalThis.fetch as any).mock.calls[1][0]).toContain("jsdelivr.net");
  });

  it("passes AbortSignal to fallback request", async () => {
    const controller = new AbortController();
    const mockJson = vi.fn().mockResolvedValue({ usd: "US Dollar" });
    globalThis.fetch = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ ok: true, json: mockJson } as any);
    await fetchCurrencies(controller.signal);
    expect((globalThis.fetch as any).mock.calls[1][1]).toEqual({
      signal: controller.signal,
    });
  });
});
