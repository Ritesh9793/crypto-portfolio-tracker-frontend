import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/axios";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function PnLReport() {
  const [summary, setSummary] = useState(null);
  const [taxSummary, setTaxSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxLoading, setTaxLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/pnl")
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("PnL fetch error", err))
      .finally(() => setLoading(false));

    api
      .get("/api/tax/hints")
      .then((res) => setTaxSummary(res.data))
      .catch((err) => console.error("Tax hints fetch error", err))
      .finally(() => setTaxLoading(false));
  }, []);

  /* ---------------- EXPORT CSV ---------------- */
  const exportToCSV = () => {
    if (!summary || !summary.assets || summary.assets.length === 0) {
      alert("No P&L data to export");
      return;
    }

    const headers = [
      "Asset",
      "Quantity",
      "Avg Buy Price (INR)",
      "Current Price (INR)",
      "Unrealized P&L (INR)",
      "Realized P&L (INR)"
    ];

    const rows = summary.assets.map((p) => [
      p.asset,
      p.quantity,
      p.avgBuyPrice,
      p.currentPrice,
      p.unrealizedPnL,
      p.realizedPnL
    ]);

    let csvContent =
      headers.join(",") + "\n" +
      rows.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pnl_report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-gray-400">
          Loading P&amp;L report...
        </div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="p-10 text-red-400">
          Failed to load P&amp;L data
        </div>
      </DashboardLayout>
    );
  }

  const chartData = summary.assets.map((a) => ({
    name: a.asset,
    unrealized: a.unrealizedPnL,
    realized: a.realizedPnL
  }));

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">

        {/* TITLE + EXPORT */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold tracking-wide">
              P&amp;L Report
            </h1>
            <p className="text-gray-400 mt-2">
              Realized and unrealized profit &amp; loss
            </p>
          </div>

          <button
            onClick={exportToCSV}
            className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-700 font-semibold"
          >
            Export CSV
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400 mb-2">Unrealized P&amp;L</h3>
            <p
              className={`text-2xl font-bold ${
                summary.totalUnrealizedPnL >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ₹{summary.totalUnrealizedPnL.toLocaleString("en-IN")}
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl border border-white/10">
            <h3 className="text-gray-400 mb-2">Realized P&amp;L</h3>
            <p
              className={`text-2xl font-bold ${
                summary.totalRealizedPnL >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ₹{summary.totalRealizedPnL.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* P&L CHART */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl mb-10">
          <h2 className="text-xl font-semibold mb-6">
            📈 Asset-wise P&amp;L
          </h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip
                  formatter={(value) =>
                    `₹${value.toLocaleString("en-IN")}`
                  }
                />

                <Line
                  type="monotone"
                  dataKey="unrealized"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />

                <Line
                  type="monotone"
                  dataKey="realized"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl mb-10">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Avg Buy</th>
                <th className="pb-4">Current</th>
                <th className="pb-4">Unrealized</th>
                <th className="pb-4">Realized</th>
              </tr>
            </thead>

            <tbody>
              {summary.assets.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-gray-400">
                    No trades found
                  </td>
                </tr>
              )}

              {summary.assets.map((p, index) => (
                <tr
                  key={index}
                  className="border-b border-white/5 hover:bg-white/5 transition-all"
                >
                  <td className="py-4 font-semibold">{p.asset}</td>
                  <td>{p.quantity}</td>
                  <td>₹{p.avgBuyPrice.toLocaleString("en-IN")}</td>
                  <td>₹{p.currentPrice.toLocaleString("en-IN")}</td>

                  <td
                    className={
                      p.unrealizedPnL >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    ₹{p.unrealizedPnL.toLocaleString("en-IN")}
                  </td>

                  <td
                    className={
                      p.realizedPnL >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    ₹{p.realizedPnL.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TAX HINTS SECTION */}
        {!taxLoading && taxSummary && (
          <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl mb-10">
            <h2 className="text-2xl font-semibold mb-6">
              💰 Tax Hints & Analysis
            </h2>

            {/* Tax Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                <p className="text-gray-400 text-sm mb-1">Total Realized Gains</p>
                <p className={`text-xl font-bold ${
                  taxSummary.totalRealizedGains >= 0 ? "text-green-400" : "text-red-400"
                }`}>
                  ₹{taxSummary.totalRealizedGains.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                <p className="text-gray-400 text-sm mb-1">Estimated Tax</p>
                <p className="text-xl font-bold text-red-400">
                  ₹{taxSummary.totalEstimatedTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20">
                <p className="text-gray-400 text-sm mb-1">Short-term Gains</p>
                <p className="text-xl font-bold text-orange-400">
                  ₹{taxSummary.shortTermGains.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Tax: ₹{taxSummary.shortTermTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              </div>

              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
                <p className="text-gray-400 text-sm mb-1">Long-term Gains</p>
                <p className="text-xl font-bold text-purple-400">
                  ₹{taxSummary.longTermGains.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-gray-500 mt-1">Tax: ₹{taxSummary.longTermTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Recommendations */}
            {taxSummary.recommendations && taxSummary.recommendations.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">📋 Recommendations</h3>
                <div className="space-y-2">
                  {taxSummary.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-sm"
                    >
                      <span className="text-yellow-400">💡</span> {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tax Hints Table */}
            {taxSummary.hints && taxSummary.hints.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">📊 Tax Details by Asset</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-gray-300 border-b border-white/10 uppercase text-xs">
                        <th className="pb-3">Asset</th>
                        <th className="pb-3">Gain</th>
                        <th className="pb-3">Estimated Tax</th>
                        <th className="pb-3">Holding Period</th>
                        <th className="pb-3">Days Held</th>
                        <th className="pb-3">Hint</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxSummary.hints.map((hint, index) => (
                        <tr
                          key={index}
                          className="border-b border-white/5 hover:bg-white/5 transition-all"
                        >
                          <td className="py-3 font-semibold">{hint.symbol}</td>
                          <td
                            className={
                              hint.realizedGain >= 0
                                ? "text-green-400"
                                : "text-red-400"
                            }
                          >
                            ₹{hint.realizedGain.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </td>
                          <td className="text-red-400">
                            ₹{hint.estimatedTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                          </td>
                          <td>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                hint.holdingPeriod === "LONG_TERM"
                                  ? "bg-purple-500/20 text-purple-400"
                                  : "bg-orange-500/20 text-orange-400"
                              }`}
                            >
                              {hint.holdingPeriod === "LONG_TERM" ? "Long-term" : "Short-term"}
                            </span>
                          </td>
                          <td className="text-gray-400">{hint.daysHeld} days</td>
                          <td className="text-gray-300 text-sm max-w-xs">
                            <span
                              className={`${
                                hint.hintType === "WARNING"
                                  ? "text-red-400"
                                  : hint.hintType === "OPTIMIZATION"
                                  ? "text-yellow-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {hint.hint}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {(!taxSummary.hints || taxSummary.hints.length === 0) && (
              <div className="text-center py-8 text-gray-400">
                No tax hints available. Realize some gains to see tax analysis.
              </div>
            )}
          </div>
        )}

        {taxLoading && (
          <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="text-center py-8 text-gray-400">
              Loading tax hints...
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
