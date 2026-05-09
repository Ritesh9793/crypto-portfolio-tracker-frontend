import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  HighRiskTrend,
  LowRiskTrend,
  MediumRiskTrend,
} from "../components/RiskTrend";
import DashboardLayout from "../layout/DashboardLayout";

export default function RiskAlerts() {
  const [coins, setCoins] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/market/coins");
      setCoins(res.data || []);
    } catch (error) {
      console.error("Market API error:", error);
      setCoins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter((coin) => classifyRisk(coin) === selectedRisk);

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Risk review</span>
            <h2 className="page-title">Classify volatile assets before they surprise you</h2>
            <p className="page-subtitle">
              Risk levels are based on recent price movement and market-cap context so
              you can review potential exposure faster.
            </p>
          </div>
        </div>

        {!selectedRisk && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <RiskCard
              title="High risk"
              description="Sharp moves or lower-cap assets that need immediate attention."
              onClick={() => setSelectedRisk("HIGH")}
            >
              <HighRiskTrend />
            </RiskCard>
            <RiskCard
              title="Medium risk"
              description="Moderate volatility that is worth monitoring closely."
              onClick={() => setSelectedRisk("MEDIUM")}
            >
              <MediumRiskTrend />
            </RiskCard>
            <RiskCard
              title="Low risk"
              description="More stable assets with comparatively lower market stress."
              onClick={() => setSelectedRisk("LOW")}
            >
              <LowRiskTrend />
            </RiskCard>
          </div>
        )}

        {selectedRisk && (
          <>
            <button
              onClick={() => setSelectedRisk(null)}
              className="app-button-secondary mb-6 px-5 py-3 text-sm font-semibold"
            >
              Back to risk overview
            </button>

            {loading ? (
              <p className="text-[#9d8c73]">Loading assets...</p>
            ) : filteredCoins.length === 0 ? (
              <div className="app-card p-5 text-sm text-[#9d8c73]">
                No assets found for this risk category.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {filteredCoins.map((coin) => (
                  <div key={coin.id} className="asset-card relative">
                    <span
                      className={`app-pill absolute right-4 top-4 ${
                        selectedRisk === "HIGH"
                          ? "bg-[rgba(239,68,68,0.12)] text-[#fca5a5]"
                          : selectedRisk === "MEDIUM"
                            ? "bg-[rgba(250,204,21,0.12)] text-[#fde68a]"
                            : "bg-[rgba(34,197,94,0.12)] text-[#86efac]"
                      }`}
                    >
                      {selectedRisk}
                    </span>

                    <img src={coin.image} alt={coin.name} className="mb-4 h-12 w-12" />
                    <h3 className="text-lg font-semibold text-[#f7f2e8]">{coin.name}</h3>
                    <p className="text-sm text-[#9d8c73]">{coin.symbol.toUpperCase()}</p>

                    <p className="mt-4 text-2xl font-semibold text-[#f7f2e8]">
                      Rs{formatINR(coin.current_price)}
                    </p>

                    <p
                      className={`mt-2 text-sm font-medium ${
                        coin.price_change_percentage_24h >= 0
                          ? "app-positive"
                          : "app-negative"
                      }`}
                    >
                      {coin.price_change_percentage_24h?.toFixed(2)}% (24h)
                    </p>

                    <p className="mt-4 text-xs text-[#9d8c73]">
                      Market cap: Rs{formatINR(coin.market_cap)}
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

function classifyRisk(coin) {
  const change = Math.abs(coin.price_change_percentage_24h || 0);

  if (change >= 10 || coin.market_cap < 1_000_000_000) return "HIGH";
  if (change >= 5) return "MEDIUM";
  return "LOW";
}

function formatINR(value) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format((value || 0) * 83);
}

function RiskCard({ title, description, onClick, children }) {
  return (
    <button onClick={onClick} className="risk-card">
      {children}
      <h3 className="mt-5 text-2xl font-semibold text-[#f7f2e8]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#cbbca5]">{description}</p>
    </button>
  );
}
