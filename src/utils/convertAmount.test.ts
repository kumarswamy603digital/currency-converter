import { describe, it, expect } from "vitest";
import { convertAmount } from "./convertAmount";

describe("convertAmount", () => {
  it("computes total and rate correctly", () => {
    const { total, rate } = convertAmount(2, 10);
    expect(total).toBe(10);
    expect(rate).toBe(5);
  });

  it("throws when toRate is not a number", () => {
    // @ts-expect-error intentional bad input for test
    expect(() => convertAmount(1, undefined)).toThrow(
      /Target currency not in response/
    );
  });

  it("handles decimal amounts", () => {
    const { total, rate } = convertAmount(2.5, 7.5);
    expect(total).toBe(7.5);
    expect(rate).toBeCloseTo(3.0);
  });

  it("handles zero amount producing Infinity rate", () => {
    const { total, rate } = convertAmount(0, 5);
    expect(total).toBe(5);
    expect(rate).toBe(Infinity);
  });

  it("handles negative amounts", () => {
    const { total, rate } = convertAmount(-2, 8);
    expect(total).toBe(8);
    expect(rate).toBe(-4);
  });
});
