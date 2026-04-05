const FRANKFURTER_CURRENCIES = "https://api.frankfurter.app/currencies";
const FALLBACK_CURRENCIES =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";

/** Keep fiat-style ISO codes only so the dropdown stays usable (fallback includes many crypto entries). */
function normalizeFallbackCurrencies(
  data: Record<string, string>
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, name] of Object.entries(data)) {
    if (typeof name !== "string" || !name.trim()) continue;
    if (!/^[a-z]{3}$/i.test(key)) continue;
    out[key.toUpperCase()] = name;
  }
  return out;
}

export async function fetchCurrencies(signal?: AbortSignal) {
  try {
    const res = await fetch(FRANKFURTER_CURRENCIES, { signal });
    if (!res.ok) throw new Error("Frankfurter currencies unavailable");
    return (await res.json()) as Record<string, string>;
  } catch {
    const res = await fetch(FALLBACK_CURRENCIES, { signal });
    if (!res.ok) throw new Error("Failed to load currencies");
    const raw = (await res.json()) as Record<string, string>;
    const normalized = normalizeFallbackCurrencies(raw);
    if (Object.keys(normalized).length === 0) {
      throw new Error("Failed to load currencies");
    }
    return normalized;
  }
}
