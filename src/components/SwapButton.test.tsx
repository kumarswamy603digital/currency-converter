import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SwapButton from "./SwapButton";

describe("SwapButton", () => {
  it("invokes onClick when pressed", () => {
    const onClick = vi.fn();
    render(<SwapButton onClick={onClick} />);
    fireEvent.click(screen.getByRole("button", { name: /swap currencies/i }));
    expect(onClick).toHaveBeenCalled();
  });

  it("exposes accessible name", () => {
    const onClick = vi.fn();
    render(<SwapButton onClick={onClick} />);
    expect(
      screen.getByRole("button", { name: /swap currencies/i })
    ).toBeInTheDocument();
  });
});
