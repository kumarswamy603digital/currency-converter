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

  it("throws on non-ok response", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false } as any);
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

  it("propagates fetch rejection errors", async () => {
    const err = new Error("network down");
    globalThis.fetch = vi.fn().mockRejectedValue(err);
    await expect(fetchCurrencies()).rejects.toBe(err);
  });
});
