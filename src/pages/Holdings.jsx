import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/axios";

/**
 * Symbol → CoinGecko ID mapping
 */
const COIN_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  ADA: "cardano",
};

/**
 * Metadata for UI
 */
const ASSET_META = {
  BTC: {
    name: "Bitcoin",
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  ETH: {
    name: "Ethereum",
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  },
  SOL: {
    name: "Solana",
    logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
  },
  ADA: {
    name: "Cardano",
    logo: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
  },
};

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [prices, setPrices] = useState({});

  /* ---------------- FETCH HOLDINGS ---------------- */
  const fetchHoldings = async () => {
    try {
      const res = await api.get("/holdings");
      setHoldings(res.data || []);
    } catch (err) {
      console.error("Error loading holdings", err);
    }
  };

  /* ---------------- FETCH LIVE PRICES (INR) ---------------- */
  const fetchLivePrices = async () => {
    try {
      const ids = Object.values(COIN_MAP).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=inr`
      );
      const data = await res.json();
      setPrices(data);
    } catch (err) {
      console.error("Error fetching prices", err);
    }
  };

  useEffect(() => {
    fetchHoldings();
    fetchLivePrices();
  }, []);

  /* ---------------- PORTFOLIO TOTAL ---------------- */
  const portfolioValue = holdings.reduce((sum, h) => {
    const coinId = COIN_MAP[h.symbol];
    const livePrice = prices[coinId]?.inr || 0;
    return sum + h.quantity * livePrice;
  }, 0);

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-wide">
            Holdings Overview
          </h1>
          <p className="text-gray-400 mt-2">
            Holdings are automatically calculated from your trades
          </p>
        </div>
{/* ALLOCATION CHART */}
<div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl mb-10">
  <h2 className="text-xl font-semibold mb-6">Portfolio Allocation</h2>

  {holdings.map((h) => {
    const coinId = COIN_MAP[h.symbol];
    const livePrice = prices[coinId]?.inr || 0;
    const value = h.quantity * livePrice;
    const percent =
      portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;

    return (
      <div key={h.id} className="mb-6">
        {/* LABEL */}
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium">
            {ASSET_META[h.symbol]?.name} ({h.symbol})
          </span>
          <span className="text-gray-400">
            {percent.toFixed(2)}%
          </span>
        </div>

        {/* BAR */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-pink-500/40 to-violet-400/50 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* VALUE */}
        <div className="text-xs text-gray-400 mt-1">
          Value: ₹{Number(value).toLocaleString("en-IN")}
        </div>
      </div>
    );
  })}
</div>

        {/* TABLE */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Avg Buy</th>
                <th className="pb-4">Live Price</th>
                <th className="pb-4">Total Value</th>
                <th className="pb-4">Weight</th>
              </tr>
            </thead>

            <tbody>
              {holdings.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">
                    No holdings yet — add trades to see positions
                  </td>
                </tr>
              )}

              {holdings.map((h) => {
                const coinId = COIN_MAP[h.symbol];
                const livePrice = prices[coinId]?.inr || 0;
                const totalValue = h.quantity * livePrice;
                const weight =
                  portfolioValue > 0
                    ? ((totalValue / portfolioValue) * 100).toFixed(2)
                    : "0.00";

                return (
                  <tr
                    key={h.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    {/* ASSET */}
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={ASSET_META[h.symbol]?.logo}
                          alt={h.symbol}
                          className="w-7 h-7 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">
                            {ASSET_META[h.symbol]?.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {h.symbol}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* QUANTITY */}
                    <td>{h.quantity}</td>

                    {/* AVG BUY */}
                    <td>
                      ₹{Number(h.price).toLocaleString("en-IN")}
                    </td>

                    {/* LIVE PRICE */}
                    <td className="text-purple-400">
                      ₹{Number(livePrice).toLocaleString("en-IN")}
                      <span className="ml-1 text-xs text-green-400">LIVE</span>
                    </td>

                    {/* TOTAL VALUE */}
                    <td className="text-green-400 font-semibold">
                      ₹{Number(totalValue).toLocaleString("en-IN")}
                    </td>

                    {/* WEIGHT */}
                    <td>{weight}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
