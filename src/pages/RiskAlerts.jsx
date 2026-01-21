import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";
import {
  HighRiskTrend,
  MediumRiskTrend,
  LowRiskTrend,
} from "../components/RiskTrend";

import PriceHistoryChart from "../components/PriceHistoryChart";

<PriceHistoryChart asset="BTC" />

export default function RiskAlerts() {
  const [coins, setCoins] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH MARKET DATA (BACKEND PROXY) ---------------- */
  const fetchCoins = async () => {
  setLoading(true);
  try {
    const res = await api.get("/api/market/coins");
    setCoins(res.data || []);
  } catch (err) {
    console.error("Market API error:", err);
    setCoins([]);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchCoins();
  }, []);

  /* ---------------- RISK CLASSIFICATION ---------------- */
  const classifyRisk = (coin) => {
    const change = Math.abs(coin.price_change_percentage_24h || 0);

    if (change >= 10 || coin.market_cap < 1_000_000_000) return "HIGH";
    if (change >= 5) return "MEDIUM";
    return "LOW";
  };

  /* ---------------- FILTERED COINS ---------------- */
  const filteredCoins = coins.filter(
    (coin) => classifyRisk(coin) === selectedRisk
  );

  /* ---------------- INR FORMAT HELPERS ---------------- */
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value * 83); // USD → INR approx

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-wide">
            Risk Alerts
          </h1>
          <p className="text-gray-400 mt-2">
            Portfolio risk classification based on real-time market behavior
          </p>
        </div>

        {/* ---------------- RISK OVERVIEW ---------------- */}
        {!selectedRisk && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* HIGH RISK */}
            <div
              onClick={() => setSelectedRisk("HIGH")}
              className="risk-card hover:shadow-red-500/40"
            >
              <HighRiskTrend />
              <h2 className="text-2xl font-bold mt-4">High Risk</h2>
              <p className="text-gray-400 mt-2">
                Highly volatile / sharp price movements
              </p>
            </div>

            {/* MEDIUM RISK */}
            <div
              onClick={() => setSelectedRisk("MEDIUM")}
              className="risk-card hover:shadow-yellow-400/40"
            >
              <MediumRiskTrend />
              <h2 className="text-2xl font-bold mt-4">Medium Risk</h2>
              <p className="text-gray-400 mt-2">
                Moderate or unstable movement
              </p>
            </div>

            {/* LOW RISK */}
            <div
              onClick={() => setSelectedRisk("LOW")}
              className="risk-card hover:shadow-green-400/40"
            >
              <LowRiskTrend />
              <h2 className="text-2xl font-bold mt-4">Low Risk</h2>
              <p className="text-gray-400 mt-2">
                Stable & blue-chip assets
              </p>
            </div>

          </div>
        )}

        {/* ---------------- ASSET GRID ---------------- */}
        {selectedRisk && (
          <>
            <button
  onClick={() => setSelectedRisk(null)}
  className="
    mb-8
    flex items-center gap-2
    px-5 py-2.5
    rounded-lg
    bg-slate-800 hover:bg-slate-700
    border border-white/10
    text-gray-200
    transition-all
  "
>
  ← Back to Risk Overview
</button>


            {loading ? (
              <p className="text-gray-400">Loading assets...</p>
            ) : filteredCoins.length === 0 ? (
              <p className="text-gray-400">
                No assets found for this risk category.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                {filteredCoins.map((coin) => (
                  <div key={coin.id} className="asset-card relative">

                    {/* RISK BADGE */}
                    <span
                      className={`absolute top-4 right-4 text-xs px-3 py-1 rounded-full ${
                        selectedRisk === "HIGH"
                          ? "bg-red-500/10 text-red-400"
                          : selectedRisk === "MEDIUM"
                          ? "bg-yellow-400/10 text-yellow-300"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {selectedRisk} RISK
                    </span>

                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-12 h-12 mb-4"
                    />

                    <h3 className="text-lg font-semibold">
                      {coin.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {coin.symbol.toUpperCase()}
                    </p>

                    <p className="mt-4 text-2xl font-bold text-white">
                      ₹{formatINR(coin.current_price)}
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                    </p>

                    <p className="text-xs text-gray-500 mt-4">
                      MCap ₹{formatINR(coin.market_cap)}
                    </p>

                  </div>
                ))}

              </div>
            )}
          </>
        )}

      </div>
    </DashboardLayout>
  );
}
