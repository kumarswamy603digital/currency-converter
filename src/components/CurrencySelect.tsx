import React from "react";

type CurrencyOption = {
  code: string;
  name?: string;
  flag?: string;
  flagUrl?: string;
};

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
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);

  const selected = currencies.find((c) => c.code === value);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: string) => {
    if (disabledCodes.includes(code)) return;
    onChange(code);
    setOpen(false);
  };

  return (
    <div className="select-group">
      <label htmlFor={id}>{label}</label>
      <div className="custom-select" ref={wrapperRef}>
        <button
          type="button"
          id={id}
          className="custom-select-toggle"
          onClick={() => setOpen((prev) => !prev)}
        >
          {selected && (
            <>
              {selected.flagUrl && (
                <span className="custom-select-flag">
                  <img src={selected.flagUrl} alt={selected.code} />
                </span>
              )}
              <span className="custom-select-code">{selected.code}</span>
              <span className="custom-select-name">{selected.name}</span>
            </>
          )}
        </button>
        {open && (
          <div className="custom-select-menu" role="listbox">
            {currencies.map((c) => {
              const disabled = disabledCodes.includes(c.code);
              const isActive = c.code === value;
              return (
                <button
                  key={c.code}
                  type="button"
                  className={`custom-select-option${
                    isActive ? " custom-select-option--active" : ""
                  }${disabled ? " custom-select-option--disabled" : ""}`}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => handleSelect(c.code)}
                >
                  {c.flagUrl && (
                    <span className="custom-select-option-flag">
                      <img src={c.flagUrl} alt={c.code} />
                    </span>
                  )}
                  <span className="custom-select-option-code">{c.code}</span>
                  <span className="custom-select-option-name">{c.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
