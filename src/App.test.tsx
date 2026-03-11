import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

vi.mock("./api/fetchCurrencies", () => ({
  fetchCurrencies: vi.fn().mockResolvedValue({ USD: "US Dollar", EUR: "Euro" }),
}));

vi.mock("./api/getRates", () => ({
  getRates: vi.fn(),
}));

import { fetchCurrencies } from "./api/fetchCurrencies";
import { getRates } from "./api/getRates";

describe("App", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (fetchCurrencies as any).mockResolvedValue({
      USD: "US Dollar",
      EUR: "Euro",
    });
  });

  it("loads currencies and converts amount", async () => {
    // After currencies load, App normalizes to from=EUR, to=USD
    (getRates as any).mockResolvedValue({
      amount: 1,
      base: "EUR",
      rates: { USD: 2 },
    });
    render(<App />);

    // Wait for selects to be populated
    const fromSelect = await screen.findByLabelText(/from/i);
    const toSelect = screen.getByLabelText(/to/i);

    // Ensure initial state then change amount and convert
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1" } });

    fireEvent.click(screen.getByRole("button", { name: /get exchange rate/i }));

    await waitFor(() => {
      expect(screen.getByText(/eur =/i)).toBeInTheDocument();
    });

    expect(getRates).toHaveBeenCalledWith(
      1,
      (fromSelect as HTMLSelectElement).value,
      (toSelect as HTMLSelectElement).value
    );
  });

  it("shows error when conversion fails", async () => {
    (getRates as any).mockRejectedValue(new Error("boom"));
    render(<App />);

    const input = await screen.findByLabelText(/enter amount/i);
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: /get exchange rate/i }));

    await screen.findByText(/boom/i);
  });

  it("swaps currencies and fetches swapped rate when valid", async () => {
    // First convert: from=EUR to=USD
    (getRates as any).mockResolvedValueOnce({
      amount: 1,
      base: "EUR",
      rates: { USD: 2 },
    });
    // After swap: from=USD to=EUR (swap handler)
    (getRates as any).mockResolvedValueOnce({
      amount: 1,
      base: "USD",
      rates: { EUR: 3 },
    });
    // After swap, clicking convert again: from=USD to=EUR
    (getRates as any).mockResolvedValueOnce({
      amount: 1,
      base: "USD",
      rates: { EUR: 3 },
    });

    render(<App />);

    const input = await screen.findByLabelText(/enter amount/i);
    fireEvent.change(input, { target: { value: "1" } });

    // Initial convert
    fireEvent.click(screen.getByRole("button", { name: /get exchange rate/i }));
    await screen.findByText(/eur =/i);

    // Swap
    fireEvent.click(screen.getByRole("button", { name: /swap currencies/i }));

    // After swap, wait for button to be ready again and click convert to reveal result
    const convertBtn = await screen.findByRole("button", {
      name: /get exchange rate/i,
    });
    fireEvent.click(convertBtn);
    await screen.findByText(/usd =/i);
    expect(getRates).toHaveBeenCalledTimes(3);
  });

  it("disables convert button for invalid amount", async () => {
    (getRates as any).mockResolvedValue({
      amount: 1,
      base: "EUR",
      rates: { USD: 2 },
    });
    render(<App />);
    await screen.findByLabelText(/from/i);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    const button = screen.getByRole("button", { name: /get exchange rate/i });
    // invalid: 0
    fireEvent.change(input, { target: { value: "0" } });
    expect(button).toBeDisabled();
    // invalid: empty
    fireEvent.change(input, { target: { value: "" } });
    expect(button).toBeDisabled();
  });

  it("shows helper text initially and loading when converting", async () => {
    (getRates as any).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () => resolve({ amount: 1, base: "EUR", rates: { USD: 2 } }),
            50
          )
        )
    );
    render(<App />);
    await screen.findByLabelText(/from/i);
    expect(
      screen.getByText(/enter an amount and click convert/i)
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /get exchange rate/i }));
    expect(
      await screen.findByText(/fetching latest rate/i)
    ).toBeInTheDocument();
  });

  it("clears result and error when inputs change", async () => {
    (getRates as any).mockResolvedValue({
      amount: 1,
      base: "EUR",
      rates: { USD: 2 },
    });
    render(<App />);
    await screen.findByLabelText(/from/i);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.click(screen.getByRole("button", { name: /get exchange rate/i }));
    await screen.findByText(/eur =/i);
    // force an error via next call
    (getRates as any).mockRejectedValueOnce(new Error("oops"));
    fireEvent.change(screen.getByLabelText(/to/i), {
      target: { value: "EUR" },
    });
    // After changing, helper should be shown again, and no result/error
    expect(
      screen.getByText(/enter an amount and click convert/i)
    ).toBeInTheDocument();
  });

  it("does not fetch on swap when amount invalid", async () => {
    (getRates as any).mockResolvedValue({
      amount: 1,
      base: "EUR",
      rates: { USD: 2 },
    });
    render(<App />);
    await screen.findByLabelText(/from/i);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: /swap currencies/i }));
    expect(getRates).not.toHaveBeenCalled();
  });
});
