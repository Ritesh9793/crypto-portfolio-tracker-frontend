import { useEffect, useState } from "react";
import api from "../api/axios";
import PriceHistoryChart from "../components/PriceHistoryChart";
import Sparkline from "../components/Sparkline";
import DashboardLayout from "../layout/DashboardLayout";

export default function Pricing() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const fetchPrices = async () => {
    try {
      const res = await api.get("/api/pricing");
      setPrices(res.data);
    } catch (error) {
      console.error("Error loading prices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Live market data</span>
            <h2 className="page-title">
              Follow pricing without leaving the workspace
            </h2>
            <p className="page-subtitle">
              Compare current price, change, market cap, and sparkline trends.
              Select any asset to inspect its price history.
            </p>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="app-table-wrap">
            <table className="app-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Symbol</th>
                  <th className="text-left">Price</th>
                  <th className="text-left">24h change</th>
                  <th className="text-left">Market cap</th>
                  <th className="text-left">7D</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td
                      colSpan="6"
                      className="py-10 text-center text-[#9d8c73]"
                    >
                      Loading prices...
                    </td>
                  </tr>
                )}

                {!loading &&
                  prices.map((price) => (
                    <tr
                      key={price.id}
                      onClick={() =>
                        setSelectedAsset(price.symbol.toUpperCase())
                      }
                      className={
                        selectedAsset === price.symbol.toUpperCase()
                          ? "bg-[rgba(211,155,52,0.08)]"
                          : ""
                      }
                    >
                      <td className="font-semibold">{price.name}</td>
                      <td className="uppercase text-[#9d8c73]">
                        {price.symbol}
                      </td>
                      <td className="text-[#e2b768]">
                        $ {price.priceUsd.toLocaleString("en-IN")}
                      </td>
                      <td
                        className={
                          price.change24h >= 0 ? "app-positive" : "app-negative"
                        }
                      >
                        {price.change24h.toFixed(2)}%
                      </td>
                      <td>$ {price.marketCap.toLocaleString("en-IN")}</td>
                      <td>
                        <Sparkline
                          data={price.sparkline}
                          positive={price.change24h >= 0}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedAsset && (
          <div className="mt-6">
            <PriceHistoryChart asset={selectedAsset} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
