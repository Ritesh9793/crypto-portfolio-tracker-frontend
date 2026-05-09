import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";

export default function PnLReport() {
  const [summary, setSummary] = useState(null);
  const [taxSummary, setTaxSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [taxLoading, setTaxLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/pnl")
      .then((res) => setSummary(res.data))
      .catch((error) => console.error("PnL fetch error", error))
      .finally(() => setLoading(false));

    api
      .get("/api/tax/hints")
      .then((res) => setTaxSummary(res.data))
      .catch((error) => console.error("Tax hints fetch error", error))
      .finally(() => setTaxLoading(false));
  }, []);

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
      "Realized P&L (INR)",
    ];

    const rows = summary.assets.map((asset) => [
      asset.asset,
      asset.quantity,
      asset.avgBuyPrice,
      asset.currentPrice,
      asset.unrealizedPnL,
      asset.realizedPnL,
    ]);

    const csvContent =
      `${headers.join(",")}\n${rows.map((row) => row.join(",")).join("\n")}`;

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
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
        <div className="app-page text-[#cbbca5]">Loading P&amp;L report...</div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="app-page text-[#fca5a5]">Failed to load P&amp;L data.</div>
      </DashboardLayout>
    );
  }

  const chartData = summary.assets.map((asset) => ({
    name: asset.asset,
    unrealized: asset.unrealizedPnL,
    realized: asset.realizedPnL,
  }));

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Reports</span>
            <h2 className="page-title">Review gains, losses, and tax guidance</h2>
            <p className="page-subtitle">
              Export the current portfolio report and keep track of realized gains,
              unrealized movement, and tax hints from the same screen.
            </p>
          </div>

          <button onClick={exportToCSV} className="app-button-primary px-5 py-3 text-sm">
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <MetricCard
            label="Unrealized P&L"
            value={summary.totalUnrealizedPnL}
            positive={summary.totalUnrealizedPnL >= 0}
          />
          <MetricCard
            label="Realized P&L"
            value={summary.totalRealizedPnL}
            positive={summary.totalRealizedPnL >= 0}
          />
        </div>

        <div className="glass-card mt-6 p-6">
          <h3 className="text-xl font-semibold text-[#f7f2e8]">Asset-wise P&amp;L</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203,188,165,0.12)" />
                <XAxis dataKey="name" stroke="#9d8c73" />
                <YAxis stroke="#9d8c73" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#22170a",
                    border: "1px solid rgba(226, 183, 104, 0.16)",
                    borderRadius: "14px",
                  }}
                  formatter={(value) =>
                    `Rs${Number(value).toLocaleString("en-IN")}`
                  }
                />
                <Line type="monotone" dataKey="unrealized" stroke="#86efac" strokeWidth={3} />
                <Line type="monotone" dataKey="realized" stroke="#fca5a5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
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
                  <th className="text-left">Current</th>
                  <th className="text-left">Unrealized</th>
                  <th className="text-left">Realized</th>
                </tr>
              </thead>
              <tbody>
                {summary.assets.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-[#9d8c73]">
                      No trades found.
                    </td>
                  </tr>
                )}

                {summary.assets.map((asset, index) => (
                  <tr key={`${asset.asset}-${index}`}>
                    <td className="font-semibold">{asset.asset}</td>
                    <td>{asset.quantity}</td>
                    <td>Rs{asset.avgBuyPrice.toLocaleString("en-IN")}</td>
                    <td>Rs{asset.currentPrice.toLocaleString("en-IN")}</td>
                    <td className={asset.unrealizedPnL >= 0 ? "app-positive" : "app-negative"}>
                      Rs{asset.unrealizedPnL.toLocaleString("en-IN")}
                    </td>
                    <td className={asset.realizedPnL >= 0 ? "app-positive" : "app-negative"}>
                      Rs{asset.realizedPnL.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!taxLoading && taxSummary && (
          <div className="glass-card mt-6 p-6">
            <h3 className="text-xl font-semibold text-[#f7f2e8]">Tax hints and analysis</h3>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <TaxTile
                label="Total realized gains"
                value={taxSummary.totalRealizedGains}
                tone="positive"
              />
              <TaxTile
                label="Estimated tax"
                value={taxSummary.totalEstimatedTax}
                tone="negative"
              />
              <TaxTile
                label="Short-term gains"
                value={taxSummary.shortTermGains}
                tone="neutral"
                helper={`Tax: Rs${taxSummary.shortTermTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              />
              <TaxTile
                label="Long-term gains"
                value={taxSummary.longTermGains}
                tone="neutral"
                helper={`Tax: Rs${taxSummary.longTermTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`}
              />
            </div>

            {taxSummary.recommendations?.length > 0 && (
              <div className="mt-6 space-y-3">
                {taxSummary.recommendations.map((recommendation, index) => (
                  <div
                    key={`${recommendation}-${index}`}
                    className="rounded-2xl border border-[rgba(250,204,21,0.18)] bg-[rgba(113,63,18,0.14)] p-4 text-sm text-[#fde68a]"
                  >
                    {recommendation}
                  </div>
                ))}
              </div>
            )}

            {taxSummary.hints?.length > 0 ? (
              <div className="app-table-wrap mt-6">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th className="text-left">Asset</th>
                      <th className="text-left">Gain</th>
                      <th className="text-left">Estimated tax</th>
                      <th className="text-left">Holding period</th>
                      <th className="text-left">Days held</th>
                      <th className="text-left">Hint</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxSummary.hints.map((hint, index) => (
                      <tr key={`${hint.symbol}-${index}`}>
                        <td className="font-semibold">{hint.symbol}</td>
                        <td className={hint.realizedGain >= 0 ? "app-positive" : "app-negative"}>
                          Rs{hint.realizedGain.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </td>
                        <td className="app-negative">
                          Rs{hint.estimatedTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        </td>
                        <td>{hint.holdingPeriod === "LONG_TERM" ? "Long-term" : "Short-term"}</td>
                        <td>{hint.daysHeld} days</td>
                        <td className="text-sm text-[#cbbca5]">{hint.hint}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4 text-sm text-[#9d8c73]">
                No tax hints available yet.
              </div>
            )}
          </div>
        )}

        {taxLoading && (
          <div className="glass-card mt-6 p-6 text-center text-[#9d8c73]">
            Loading tax hints...
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ label, value, positive }) {
  return (
    <div className="app-stat-card p-6">
      <p className="text-sm text-[#9d8c73]">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${positive ? "app-positive" : "app-negative"}`}>
        Rs{value.toLocaleString("en-IN")}
      </p>
    </div>
  );
}

function TaxTile({ label, value, tone, helper }) {
  const toneClass =
    tone === "positive"
      ? "app-positive"
      : tone === "negative"
        ? "app-negative"
        : "app-neutral";

  return (
    <div className="rounded-[1.35rem] border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-5">
      <p className="text-sm text-[#9d8c73]">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${toneClass}`}>
        Rs{value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
      </p>
      {helper && <p className="mt-2 text-xs text-[#cbbca5]">{helper}</p>}
    </div>
  );
}
