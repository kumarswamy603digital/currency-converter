import React from "react";

type CurrencyOption = { code: string; name?: string; flag?: string };

type Props = {
  label: string;
  value: string;
  onChange: (code: string) => void;
  currencies: CurrencyOption[];
  id: string;
  disabledCodes?: string[];
};

export default function CurrencySelect({
  label,
  value,
  onChange,
  currencies,
  id,
  disabledCodes = [],
}: Props) {
  return (
    <div className="select-group">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="select"
        value={value}
        onChange={(e) => onChange(e.target.value as any)}
      >
        {currencies.map((c) => (
          <option
            key={c.code}
            value={c.code}
            disabled={disabledCodes.includes(c.code)}
          >
            {c.flag ? `${c.flag} ${c.code}` : c.code}
          </option>
        ))}
      </select>
    </div>
  );
}
