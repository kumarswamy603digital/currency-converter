import React from "react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencySelect from "./CurrencySelect";

const currencies = [
  { code: "EUR", name: "Euro", flag: "🇪🇺" },
  { code: "USD", name: "US Dollar", flag: "🇺🇸" },
];

describe("CurrencySelect", () => {
  it("renders options and calls onChange", () => {
    const onChange = vi.fn();
    render(
      <CurrencySelect
        id="from"
        label="From"
        value="EUR"
        onChange={onChange}
        currencies={currencies}
      />
    );
    const select = screen.getByLabelText(/from/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "USD" } });
    expect(onChange).toHaveBeenCalledWith("USD");
  });

  it("disables provided codes", () => {
    const onChange = vi.fn();
    render(
      <CurrencySelect
        id="to"
        label="To"
        value="USD"
        onChange={onChange}
        currencies={currencies}
        disabledCodes={["USD"]}
      />
    );
    const option = screen.getByRole("option", { name: /🇺🇸 usd/i });
    expect(option).toBeDisabled();
  });

  it("renders code when flag missing", () => {
    const onChange = vi.fn();
    render(
      <CurrencySelect
        id="to"
        label="To"
        value="USD"
        onChange={onChange}
        currencies={[{ code: "JPY" }, { code: "USD" }]}
      />
    );
    expect(screen.getByRole("option", { name: /jpy/i })).toBeInTheDocument();
  });

  it("maintains selected value", () => {
    const onChange = vi.fn();
    render(
      <CurrencySelect
        id="from"
        label="From"
        value="USD"
        onChange={onChange}
        currencies={currencies}
      />
    );
    const select = screen.getByLabelText(/from/i) as HTMLSelectElement;
    expect(select.value).toBe("USD");
  });
});
