import { useEffect, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";

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

  const fetchHoldings = async () => {
    try {
      const res = await api.get("/api/holdings");
      setHoldings(res.data || []);
    } catch (error) {
      console.error("Error loading holdings", error);
    }
  };

  const fetchLivePrices = async () => {
    try {
      const res = await api.get("/api/pricing");
      const priceMap = {};

      (res.data || []).forEach((item) => {
        priceMap[item.symbol?.toUpperCase()] = Number(item.priceUsd || 0);
      });

      setPrices(priceMap);
    } catch (error) {
      console.error("Error fetching prices", error);
    }
  };

  useEffect(() => {
    fetchHoldings();
    fetchLivePrices();
  }, []);

  const portfolioValue = holdings.reduce((sum, holding) => {
    const livePrice = prices[holding.symbol?.toUpperCase()] || 0;
    return sum + holding.quantity * livePrice;
  }, 0);

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Holdings</span>
            <h2 className="page-title">See how your portfolio is distributed</h2>
            <p className="page-subtitle">
              Holdings are derived from trade activity so you can review allocation,
              live value, and portfolio weight from one place.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold text-[#f7f2e8]">Portfolio allocation</h3>
          <p className="mt-2 text-sm text-[#9d8c73]">
            Percentage split across tracked assets.
          </p>

          <div className="mt-6 space-y-5">
            {holdings.map((holding) => {
              const livePrice = prices[holding.symbol?.toUpperCase()] || 0;
              const value = holding.quantity * livePrice;
              const percent = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;

              return (
                <div key={holding.id}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-[#f7f2e8]">
                      {ASSET_META[holding.symbol]?.name} ({holding.symbol})
                    </span>
                    <span className="text-[#cbbca5]">{percent.toFixed(2)}%</span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-[rgba(255,248,236,0.06)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#d39b34,#915b0a)] transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-[#9d8c73]">
                    Value: Rs{Number(value).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}

            {holdings.length === 0 && (
              <div className="rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4 text-sm text-[#9d8c73]">
                No holdings yet. Add trades to see positions.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card mt-6 p-6">
          <div className="app-table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Avg buy</th>
                  <th className="text-left">Live price</th>
                  <th className="text-left">Total value</th>
                  <th className="text-left">Weight</th>
                </tr>
              </thead>
              <tbody>
                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-10 text-center text-[#9d8c73]">
                      No holdings yet. Add trades to see positions.
                    </td>
                  </tr>
                )}

                {holdings.map((holding) => {
                  const livePrice = prices[holding.symbol?.toUpperCase()] || 0;
                  const totalValue = holding.quantity * livePrice;
                  const weight =
                    portfolioValue > 0
                      ? ((totalValue / portfolioValue) * 100).toFixed(2)
                      : "0.00";

                  return (
                    <tr key={holding.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <img
                            src={ASSET_META[holding.symbol]?.logo}
                            alt={holding.symbol}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <div className="font-semibold text-[#f7f2e8]">
                              {ASSET_META[holding.symbol]?.name}
                            </div>
                            <div className="text-xs text-[#9d8c73]">{holding.symbol}</div>
                          </div>
                        </div>
                      </td>
                      <td>{holding.quantity}</td>
                      <td>Rs{Number(holding.price).toLocaleString("en-IN")}</td>
                      <td className="text-[#e2b768]">
                        Rs{Number(livePrice).toLocaleString("en-IN")}
                      </td>
                      <td className="app-positive font-semibold">
                        Rs{Number(totalValue).toLocaleString("en-IN")}
                      </td>
                      <td>{weight}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
