export function makeFlagFromCurrency(code: string): string | undefined {
  const region = code === "EUR" ? "EU" : code.slice(0, 2);
  // Validate region
  try {
    const display = new (Intl as any).DisplayNames(undefined, {
      type: "region",
    });
    const name = display.of(region);
    if (!name || typeof name !== "string") return undefined;
  } catch {
    return undefined;
  }
  const A = 0x1f1e6;
  const flag = String.fromCodePoint(
    ...region
      .toUpperCase()
      .split("")
      .map((ch) => A + ch.charCodeAt(0) - 65)
  );
  return flag;
}
