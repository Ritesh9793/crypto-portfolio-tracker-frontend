import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";
import AIAssistant from "../components/AiAssistant";
import Sparkline from "../components/Sparkline";
import DashboardLayout from "../layout/DashboardLayout";

const formatCurrency = (value) =>
  `Rs${Number(value || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [pricing, setPricing] = useState([]);
  const [riskCoins, setRiskCoins] = useState([]);
  const [range, setRange] = useState("30D");
  const [trades, setTrades] = useState([]);
  const [pnl, setPnl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    Promise.allSettled([
      api.get("/api/dashboard/summary"),
      api.get("/api/holdings"),
      api.get("/api/pricing"),
      api.get("/api/market/coins"),
      api.get("/api/trades/get-trades"),
      api.get("/api/pnl"),
      api.get("/api/notifications"),
    ])
      .then((results) => {
        const [
          summaryRes,
          holdingsRes,
          pricingRes,
          marketCoinsRes,
          tradesRes,
          pnlRes,
          notificationsRes,
        ] = results;

        setSummary(summaryRes.status === "fulfilled" ? summaryRes.value.data : {});
        setHoldings(holdingsRes.status === "fulfilled" ? holdingsRes.value.data : []);
        setPricing(pricingRes.status === "fulfilled" ? pricingRes.value.data : []);
        setRiskCoins(
          marketCoinsRes.status === "fulfilled" ? marketCoinsRes.value.data : [],
        );
        setTrades(tradesRes.status === "fulfilled" ? tradesRes.value.data : []);
        setPnl(pnlRes.status === "fulfilled" ? pnlRes.value.data : null);
        setNotifications(
          notificationsRes.status === "fulfilled"
            ? notificationsRes.value.data
            : [],
        );
      })
      .catch((error) => {
        console.error("Dashboard load error", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const holdingMap = useMemo(() => {
    const map = {};
    holdings.forEach((holding) => {
      map[holding.symbol?.toUpperCase()] = Number(holding.quantity || 0);
    });
    return map;
  }, [holdings]);

  const portfolioHistory = useMemo(() => {
    if (!pricing.length) return [];

    const length = pricing[0].sparkline?.length || 0;
    const values = [];

    for (let index = 0; index < length; index += 1) {
      let total = 0;
      pricing.forEach((coin) => {
        const quantity = holdingMap[coin.symbol] || 0;
        total += quantity * (coin.sparkline?.[index] || 0);
      });
      values.push(total);
    }

    return values;
  }, [pricing, holdingMap]);

  const rangeMap = { "24H": 1, "7D": 7, "30D": 30 };
  const slicedValues = portfolioHistory.slice(-rangeMap[range]);

  const chartData = useMemo(() => {
    const today = new Date();
    return slicedValues.map((value, index) => {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() - (slicedValues.length - 1 - index));
      return {
        date: currentDate.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        value: Math.round(value),
      };
    });
  }, [slicedValues]);

  const dashboardRiskAlerts =
    Array.isArray(riskCoins)
      ? riskCoins
          .map((coin) => ({
            ...coin,
            risk: classifyRisk(coin),
          }))
          .filter((coin) => coin.risk === "HIGH" || coin.risk === "MEDIUM")
          .slice(0, 3)
      : [];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="app-page text-[#cbbca5]">Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="app-page text-[#fca5a5]">Failed to load dashboard data.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Overview</span>
            <h2 className="page-title">A focused view of your crypto activity</h2>
            <p className="page-subtitle">
              Review performance, flagged assets, recent trades, reporting, and
              live market movement without switching screens.
            </p>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SummaryCard
            title="Total portfolio value"
            value={formatCurrency(summary.totalPortfolioValue)}
            helper="Live value across tracked holdings"
          />
          <SummaryCard
            title="Realized P&L"
            value={formatCurrency(summary.realizedPnL)}
            helper="Closed trade performance"
          />
          <SummaryCard
            title="Active holdings"
            value={summary.activeHoldings || 0}
            helper={`${dashboardRiskAlerts.length} flagged assets in review`}
          />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,0.8fr)]">
          <div className="app-card p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                  Portfolio performance
                </h3>
                <p className="mt-2 text-sm text-[#9d8c73]">
                  Track how the combined portfolio value changes over time.
                </p>
              </div>

              <div className="flex gap-2 text-sm">
                {["24H", "7D", "30D"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setRange(item)}
                    className={`rounded-full px-4 py-2 font-semibold transition ${
                      range === item
                        ? "bg-[rgba(211,155,52,0.14)] text-[#f7f2e8]"
                        : "bg-[rgba(255,248,236,0.03)] text-[#cbbca5] hover:text-[#f7f2e8]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#9d8c73" />
                  <YAxis
                    stroke="#9d8c73"
                    tickFormatter={(value) => `Rs${Math.round(value / 1000)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#22170a",
                      border: "1px solid rgba(226, 183, 104, 0.16)",
                      borderRadius: "14px",
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#d39b34"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="app-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                  Risk alerts
                </h3>
                <p className="mt-2 text-sm text-[#9d8c73]">
                  Assets that need quicker review.
                </p>
              </div>

              <Link to="/risk-alerts" className="text-sm font-semibold text-[#d39b34]">
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {dashboardRiskAlerts.length === 0 && (
                <div className="rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4 text-sm text-[#9d8c73]">
                  No major alerts right now.
                </div>
              )}

              {dashboardRiskAlerts.map((coin) => (
                <div
                  key={coin.id}
                  className={`rounded-2xl border p-4 ${
                    coin.risk === "HIGH"
                      ? "border-[rgba(239,68,68,0.18)] bg-[rgba(127,29,29,0.14)]"
                      : "border-[rgba(250,204,21,0.18)] bg-[rgba(113,63,18,0.14)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold tracking-[0.08em] text-[#f7f2e8]">
                        {coin.symbol.toUpperCase()}
                      </p>
                      <p className="mt-1 text-xs text-[#cbbca5]">
                        {coin.price_change_percentage_24h?.toFixed(2)}% in 24h
                      </p>
                    </div>
                    <span className="app-pill bg-[rgba(255,248,236,0.08)] text-[#f7f2e8]">
                      {coin.risk}
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-[#9d8c73]">
                    Market cap: Rs{Math.round((coin.market_cap || 0) / 1e7)} Cr
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 app-card p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                Asset breakdown
              </h3>
              <p className="mt-2 text-sm text-[#9d8c73]">
                A detailed view of quantity, buy price, live value, and position size.
              </p>
            </div>
          </div>

          <div className="app-table-wrap mt-6">
            <table className="app-table">
              <thead>
                <tr>
                  <th className="text-left">Asset</th>
                  <th className="text-left">Quantity</th>
                  <th className="text-left">Avg cost</th>
                  <th className="text-left">Current price</th>
                  <th className="text-right">Total value</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => {
                  const coin = pricing.find((item) => item.symbol === holding.symbol);
                  const livePrice = coin?.priceUsd || 0;
                  const totalValue = holding.quantity * livePrice;

                  return (
                    <tr key={holding.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(211,155,52,0.14)] font-semibold text-[#f7f2e8]">
                            {holding.symbol}
                          </div>
                          <div>
                            <p className="font-semibold text-[#f7f2e8]">{holding.symbol}</p>
                            <p className="text-xs text-[#9d8c73]">Tracked position</p>
                          </div>
                        </div>
                      </td>
                      <td>{holding.quantity}</td>
                      <td>{formatCurrency(holding.price)}</td>
                      <td>
                        <span className="text-[#e2b768]">{formatCurrency(livePrice)}</span>
                      </td>
                      <td className="text-right font-semibold text-[#86efac]">
                        {formatCurrency(totalValue)}
                      </td>
                    </tr>
                  );
                })}

                {holdings.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-[#9d8c73]">
                      No holdings yet. Add trades to see positions here.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <DataTableCard
            title="Recent trades"
            subtitle="Latest portfolio activity"
            headers={["Asset", "Side", "Quantity", "Price", "Date"]}
            emptyMessage="No trades yet."
            rows={trades.slice(0, 5).map((trade) => (
              <tr key={trade.id}>
                <td className="font-semibold">{trade.assetSymbol}</td>
                <td className={trade.side === "BUY" ? "app-positive" : "app-negative"}>
                  {trade.side}
                </td>
                <td>{trade.quantity}</td>
                <td>{formatCurrency(trade.price)}</td>
                <td>{new Date(trade.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
            colSpan={5}
          />

          <div className="app-card p-6">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
              P&L summary
            </h3>
            <p className="mt-2 text-sm text-[#9d8c73]">
              Realized and unrealized results at a glance.
            </p>

            {pnl ? (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <ResultTile
                  label="Unrealized P&L"
                  value={formatCurrency(pnl.totalUnrealizedPnL)}
                  positive={pnl.totalUnrealizedPnL >= 0}
                />
                <ResultTile
                  label="Realized P&L"
                  value={formatCurrency(pnl.totalRealizedPnL)}
                  positive={pnl.totalRealizedPnL >= 0}
                />
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4 text-sm text-[#9d8c73]">
                P&L data is unavailable right now.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="app-card p-6">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
              Notifications
            </h3>
            <p className="mt-2 text-sm text-[#9d8c73]">
              Recent account and market updates.
            </p>

            <div className="mt-6 space-y-3">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4"
                >
                  <p className="text-sm text-[#f7f2e8]">{notification.message}</p>
                  <p className="mt-2 text-xs text-[#9d8c73]">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="rounded-2xl border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4 text-sm text-[#9d8c73]">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>

          <div className="app-card p-6">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
              Pricing snapshot
            </h3>
            <p className="mt-2 text-sm text-[#9d8c73]">
              Current prices and short-term market direction.
            </p>

            <div className="app-table-wrap mt-6">
              <table className="app-table">
                <thead>
                  <tr>
                    <th className="text-left">Symbol</th>
                    <th className="text-left">Price</th>
                    <th className="text-left">Change</th>
                    <th className="text-left">7D</th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.slice(0, 10).map((item) => (
                    <tr key={item.symbol}>
                      <td className="font-semibold">{item.symbol}</td>
                      <td>Rs{Number(item.priceUsd).toLocaleString("en-IN")}</td>
                      <td className={item.change24h >= 0 ? "app-positive" : "app-negative"}>
                        {item.change24h.toFixed(2)}%
                      </td>
                      <td>
                        <Sparkline data={item.sparkline} positive={item.change24h >= 0} />
                      </td>
                    </tr>
                  ))}

                  {pricing.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-10 text-center text-[#9d8c73]">
                        No pricing data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      <AIAssistant />
    </DashboardLayout>
  );
}

function classifyRisk(coin) {
  const change = Math.abs(coin.price_change_percentage_24h || 0);
  if (change >= 10 || coin.market_cap < 1_000_000_000) return "HIGH";
  if (change >= 5) return "MEDIUM";
  return "LOW";
}

function SummaryCard({ title, value, helper }) {
  return (
    <div className="app-stat-card p-6">
      <p className="text-sm font-medium text-[#9d8c73]">{title}</p>
      <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#cbbca5]">{helper}</p>
    </div>
  );
}

function ResultTile({ label, value, positive }) {
  return (
    <div
      className={`rounded-[1.35rem] border p-5 ${
        positive
          ? "border-[rgba(34,197,94,0.2)] bg-[rgba(34,197,94,0.08)]"
          : "border-[rgba(239,68,68,0.2)] bg-[rgba(127,29,29,0.16)]"
      }`}
    >
      <p className="text-sm text-[#cbbca5]">{label}</p>
      <p className={`mt-3 text-2xl font-semibold ${positive ? "app-positive" : "app-negative"}`}>
        {value}
      </p>
    </div>
  );
}

function DataTableCard({
  title,
  subtitle,
  headers,
  rows,
  emptyMessage,
  colSpan,
}) {
  return (
    <div className="app-card p-6">
      <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#9d8c73]">{subtitle}</p>

      <div className="app-table-wrap mt-6">
        <table className="app-table">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header} className="text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows
            ) : (
              <tr>
                <td colSpan={colSpan} className="py-10 text-center text-[#9d8c73]">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
