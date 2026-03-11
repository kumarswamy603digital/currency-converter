export function makeFlagFromCurrency(code: string): string | undefined {
  const region = code === "EUR" ? "EU" : code.slice(0, 2);

  if (!/^[A-Za-z]{2}$/.test(region)) return undefined;

  const A = 0x1f1e6;
  const flag = String.fromCodePoint(
    ...region
      .toUpperCase()
      .split("")
      .map((ch) => A + ch.charCodeAt(0) - 65)
  );

  return flag;
}
