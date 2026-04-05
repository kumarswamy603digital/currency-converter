type RatesResponse = {
  amount: number;
  base: string;
  rates: Record<string, number>;
};

export async function getRates(
  amount: number,
  from: string,
  to: string,
  signal?: AbortSignal
) {
  const url = new URL("https://api.frankfurter.app/latest");
  url.searchParams.set("amount", String(amount));
  url.searchParams.set("from", from);
  url.searchParams.set("to", to);

  try {
    const res = await fetch(url.toString(), { signal });
    if (res.ok) {
      return (await res.json()) as RatesResponse;
    }
  } catch {
    /* try CDN fallback */
  }

  const fromKey = from.toLowerCase();
  const toKey = to.toLowerCase();
  const fallbackUrl = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromKey}.json`;
  const res = await fetch(fallbackUrl, { signal });
  if (!res.ok) {
    throw new Error(`Frankfurter error: ${res.status}`);
  }
  const data = (await res.json()) as Record<string, Record<string, number>>;
  const ratesObj = data[fromKey];
  if (!ratesObj) throw new Error(`No rates for ${from}`);
  const rate = ratesObj[toKey];
  if (typeof rate !== "number") {
    throw new Error(`No rate for ${from} → ${to}`);
  }
  return {
    amount,
    base: from,
    rates: { [to]: amount * rate },
  } satisfies RatesResponse;
}
