export async function fetchCurrencies(signal?: AbortSignal) {
  const res = await fetch("https://api.frankfurter.app/currencies", { signal });
  if (!res.ok) throw new Error("Failed to load currencies");
  return await res.json() as Record<string, string>;
}
