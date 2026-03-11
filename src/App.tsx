import React, { useMemo, useState } from "react";
import AmountInput from "./components/AmountInput";
import CurrencySelect from "./components/CurrencySelect";
import SwapButton from "./components/SwapButton";
import Result from "./components/Result";
import { fetchCurrencies } from "./api/fetchCurrencies";
import { getRates } from "./api/getRates";
import { makeFlagFromCurrency } from "./utils/makeFlagFromCurrency";
import { convertAmount } from "./utils/convertAmount";

function App() {
  const [amount, setAmount] = useState<string>("1");
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("NPR");
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasConverted, setHasConverted] = useState(false);
  const [currencies, setCurrencies] = useState<
    { code: string; name: string; flag?: string }[]
  >([]);

  React.useEffect(() => {
    const controller = new AbortController();
    async function loadSymbols() {
      try {
        const data = await fetchCurrencies(controller.signal);
        const list = Object.entries(data)
          .map(([code, name]) => ({
            code,
            name,
            flag: makeFlagFromCurrency(code),
          }))
          .sort((a, b) => a.code.localeCompare(b.code));
        setCurrencies(list);
        const codes = list.map((c) => c.code);
        if (!codes.includes(from) || !codes.includes(to) || from === to) {
          setFrom(codes[0]);
          setTo(codes.find((c) => c !== codes[0]) || codes[0]);
        }
      } catch (e) {
        // keep silent
      }
    }
    loadSymbols();
    return () => controller.abort();
  }, []);

  // Clear result and errors when amount/from/to changes
  React.useEffect(() => {
    setTotal(null);
    setError(null);
    setHasConverted(false);
  }, [amount, from, to]);

  const isValidAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) && n > 0;
  }, [amount]);

  const handleConvert = async () => {
    if (!isValidAmount) return;
    setError(null);
    setLoading(true);
    try {
      const data = await getRates(Number(amount), from, to);
      const { total } = convertAmount(Number(amount), data.rates[to]);
      setTotal(total);
      setHasConverted(true);
    } catch (e) {
      setError(e?.message || "Failed to fetch rate");
      setTotal(null);
      setHasConverted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = async () => {
    setFrom(to);
    setTo(from);
    if (isValidAmount) {
      try {
        setLoading(true);
        const data = await getRates(Number(amount), to, from);
        const { total: swapped } = convertAmount(
          Number(amount),
          data.rates[from]
        );
        setTotal(swapped);
        setError(null);
      } catch (e: any) {
        setError(e?.message || "Failed to fetch rate");
        setTotal(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-root">
      <div className="card">
        <h1>Currency Converter</h1>

        <AmountInput value={amount} onChange={setAmount} />

        <div className="row">
          <CurrencySelect
            id="from"
            label="From"
            value={from}
            onChange={setFrom}
            currencies={currencies}
            disabledCodes={[to]}
          />
          <SwapButton onClick={handleSwap} />
          <CurrencySelect
            id="to"
            label="To"
            value={to}
            onChange={setTo}
            currencies={currencies}
            disabledCodes={[from]}
          />
        </div>

        {error && (
          <p className="result" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        )}
        {loading && <p className="result">Fetching latest rate…</p>}
        {!hasConverted && !loading && !error && (
          <p className="result" style={{ color: "#666" }}>
            Enter an amount and click convert to see the result.
          </p>
        )}
        {total != null && !loading && !error && hasConverted && (
          <Result amount={Number(amount)} from={from} to={to} total={total} />
        )}

        <button
          className="btn-primary"
          onClick={handleConvert}
          disabled={!isValidAmount || loading}
        >
          {loading ? "Loading…" : "Get Exchange Rate"}
        </button>
      </div>
    </div>
  );
}

export default App;
