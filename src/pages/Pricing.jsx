import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/axios";
import Sparkline from "../components/Sparkline";
import PriceHistoryChart from "../components/PriceHistoryChart";

export default function Pricing() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchPrices = async () => {
    try {
      const res = await api.get("/pricing");
      setPrices(res.data);
    } catch (err) {
      console.log("Error loading prices", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">

        {/* TITLE */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-wide">
            Live Crypto Pricing
          </h1>
          <p className="text-gray-400 mt-2">
            Market prices and historical trends
          </p>
        </div>

        {/* TABLE */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Symbol</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">24h Change</th>
                <th className="pb-4">Market Cap</th>
                <th className="pb-4">7D</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">
                    Loading prices...
                  </td>
                </tr>
              )}

              {!loading &&
                prices.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() =>
                      setSelectedAsset(p.symbol.toUpperCase())
                    }
                    className={`
                      border-b border-white/5
                      hover:bg-white/5
                      transition-all
                      cursor-pointer
                      ${selectedAsset === p.symbol.toUpperCase()
                        ? "bg-white/10"
                        : ""}
                    `}
                  >
                    <td className="py-4 font-semibold">{p.name}</td>

                    <td className="uppercase text-gray-400">
                      {p.symbol}
                    </td>

                    <td className="text-green-400 font-semibold">
                      ₹{p.priceUsd.toLocaleString("en-IN")}
                    </td>

                    <td
                      className={`font-semibold ${
                        p.change24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {p.change24h.toFixed(2)}%
                    </td>

                    <td className="text-gray-300">
                      ₹{p.marketCap.toLocaleString("en-IN")}
                    </td>

                    <td>
                      <Sparkline
                        data={p.sparkline}
                        positive={p.change24h >= 0}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* PRICE HISTORY CHART */}
        {selectedAsset && (
          <div className="mt-12">
            <PriceHistoryChart asset={selectedAsset} />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
