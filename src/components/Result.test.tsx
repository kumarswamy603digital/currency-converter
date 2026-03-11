import React from "react";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Result from "./Result";

describe("Result", () => {
  it("renders formatted output", () => {
    render(<Result amount={1.234} from="USD" to="EUR" total={2.345} />);
    expect(screen.getByText(/usd =/i)).toBeInTheDocument();
  });

  it("rounds to two fraction digits", () => {
    render(<Result amount={1.2399} from="USD" to="EUR" total={2.996} />);
    expect(screen.getByText(/1.24/i)).toBeInTheDocument();
    // With maximumFractionDigits: 2, 2.996 rounds to 3 without trailing zeros
    expect(screen.getByText(/ 3 /i)).toBeInTheDocument();
  });
});
