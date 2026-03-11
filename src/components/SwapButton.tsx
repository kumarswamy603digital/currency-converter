import React from "react";

type Props = { onClick: () => void };

export default function SwapButton({ onClick }: Props) {
  return (
    <button
      type="button"
      aria-label="Swap currencies"
      className="swap"
      onClick={onClick}
    >
      ⇄
    </button>
  );
}
