import { describe, it, expect } from "vitest";
import { makeFlagFromCurrency } from "./makeFlagFromCurrency";

describe("makeFlagFromCurrency", () => {
  it("returns correct flag for USD", () => {
    expect(makeFlagFromCurrency("USD")).toBe("🇺🇸");
  });

  it("uses EU flag for EUR", () => {
    expect(makeFlagFromCurrency("EUR")).toBe("🇪🇺");
  });

  it("is case-insensitive for input code", () => {
    expect(makeFlagFromCurrency("gbp")).toBe("🇬🇧");
  });

  it("returns undefined for invalid code", () => {
    expect(makeFlagFromCurrency("")).toBeUndefined();
    // single character cannot form a valid regional indicator pair
    // @ts-expect-error testing invalid length
    expect(makeFlagFromCurrency("X")).toBeUndefined();
  });
});
