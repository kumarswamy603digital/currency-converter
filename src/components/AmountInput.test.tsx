import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AmountInput from "./AmountInput";

describe("AmountInput", () => {
  it("filters non-numeric characters and calls onChange", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12a.3b" } });
    expect(onChange).toHaveBeenCalledWith("12.3");
  });

  it("blocks updates exceeding max integer digits", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} maxIntegerDigits={2} />);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "123" } });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows exactly max integer digits", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} maxIntegerDigits={3} />);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "999" } });
    expect(onChange).toHaveBeenCalledWith("999");
  });

  it("keeps only the first decimal point (subsequent digits kept)", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    const input = screen.getByLabelText(/enter amount/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "1.2.3.4" } });
    expect(onChange).toHaveBeenCalledWith("1.2.34");
  });

  it("shows helper text with aria-describedby", () => {
    const onChange = vi.fn();
    render(<AmountInput value="" onChange={onChange} />);
    const help = screen.getByText(/up to 12 digits/i);
    const input = screen.getByLabelText(/enter amount/i);
    expect(help).toBeInTheDocument();
    expect(input).toHaveAttribute("aria-describedby");
  });
});
