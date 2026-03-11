import React from "react";

type Props = {
  amount: number;
  from: string;
  to: string;
  total: number;
};

export default function Result({ amount, from, to, total }: Props) {
  const format = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 });
  return (
    <p className="result" aria-live="polite">
      {format.format(amount)} {from} = {format.format(total)} {to}
    </p>
  );
}
