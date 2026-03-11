export function convertAmount(amount: number, toRate: number): { rate: number; total: number } {
  const total = toRate;
  if (typeof total !== "number") {
    throw new Error("Target currency not in response");
  }
  const rate = total / amount;
  return { rate, total };
}
