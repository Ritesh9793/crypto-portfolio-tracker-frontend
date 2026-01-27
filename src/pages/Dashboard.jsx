import { useEffect, useMemo, useState } from "react";
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
  const [priceHistory, setPriceHistory] = useState([]);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    Promise.allSettled([
      api.get("/api/dashboard/summary"),
      api.get("/api/holdings"),
      api.get("/api/pricing"),
      api.get("/api/market/coins"),
      api.get("/api/trades/get-trades"),
      api.get("/api/pnl"),
      api.get("/api/notifications"),
      api.get("/api/prices"),
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
          priceHistoryRes,
        ] = results;

        setSummary(
          summaryRes.status === "fulfilled" ? summaryRes.value.data : {},
        );
        setHoldings(
          holdingsRes.status === "fulfilled" ? holdingsRes.value.data : [],
        );
        setPricing(
          pricingRes.status === "fulfilled" ? pricingRes.value.data : [],
        );
        setRiskCoins(
          marketCoinsRes.status === "fulfilled"
            ? marketCoinsRes.value.data
            : [],
        );
        setTrades(tradesRes.status === "fulfilled" ? tradesRes.value.data : []);
        setPnl(pnlRes.status === "fulfilled" ? pnlRes.value.data : null);
        setNotifications(
          notificationsRes.status === "fulfilled"
            ? notificationsRes.value.data
            : [],
        );
        setPriceHistory(
          priceHistoryRes.status === "fulfilled"
            ? priceHistoryRes.value.data
            : [],
        );
      })
      .catch((err) => {
        console.error("Dashboard load error", err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------------- HOLDINGS MAP ---------------- */
  const holdingMap = useMemo(() => {
    const map = {};
    holdings.forEach((h) => {
      map[h.symbol?.toUpperCase()] = Number(h.quantity || 0);
    });
    return map;
  }, [holdings]);

  /* ---------------- PORTFOLIO HISTORY ---------------- */
  const portfolioHistory = useMemo(() => {
    if (!pricing.length) return [];

    const len = pricing[0].sparkline?.length || 0;
    const values = [];

    for (let i = 0; i < len; i++) {
      let total = 0;
      pricing.forEach((coin) => {
        const qty = holdingMap[coin.symbol] || 0;
        total += qty * (coin.sparkline?.[i] || 0);
      });
      values.push(total);
    }

    return values;
  }, [pricing, holdingMap]);

  /* ---------------- RANGE ---------------- */
  const rangeMap = { "24H": 1, "7D": 7, "30D": 30 };
  const slicedValues = portfolioHistory.slice(-rangeMap[range]);

  const chartData = useMemo(() => {
    const today = new Date();
    return slicedValues.map((value, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() - (slicedValues.length - 1 - idx));
      return {
        date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        value: Math.round(value),
      };
    });
  }, [slicedValues]);

  /* ---------------- RISK LOGIC (SAME AS RiskAlerts.jsx) ---------------- */
  const classifyRisk = (coin) => {
    const change = Math.abs(coin.price_change_percentage_24h || 0);
    if (change >= 10 || coin.market_cap < 1_000_000_000) return "HIGH";
    if (change >= 5) return "MEDIUM";
    return "LOW";
  };

  const dashboardRiskAlerts =
    riskCoins && Array.isArray(riskCoins)
      ? riskCoins
          .map((coin) => ({
            ...coin,
            risk: classifyRisk(coin),
          }))
          .filter((coin) => coin.risk === "HIGH" || coin.risk === "MEDIUM")
          .slice(0, 3)
      : [];

  /* ---------------- LOADING STATES ---------------- */
  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-10 text-gray-400">Loading dashboard…</div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout>
        <div className="p-10 text-red-400">Failed to load dashboard data</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 min-h-screen text-white bg-gradient-to-br from-black via-[#06010d] to-black">
        {/* HEADER */}
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-400 mb-6">
          Welcome back! Here's your portfolio overview.
        </p>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SummaryCard
            title="Total Portfolio Value"
            value={`₹${Number(summary.totalPortfolioValue).toLocaleString("en-IN")}`}
            gradient="from-purple-600/30 to-pink-600/30"
          />

          <SummaryCard
            title="Total P&L"
            value={`₹${Number(summary.realizedPnL).toLocaleString("en-IN")}`}
            gradient="from-green-500/30 to-emerald-600/30"
          />

          <SummaryCard
            title="Total Assets"
            value={summary.activeHoldings}
            sub="1 flagged"
            gradient="from-blue-500/30 to-indigo-600/30"
          />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PORTFOLIO PERFORMANCE */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-lg font-semibold">Portfolio Performance</h2>
                <p className="text-gray-400 text-sm">
                  Track your portfolio value over time
                </p>
              </div>

              {/* CLICKABLE RANGE BUTTONS */}
              <div className="flex gap-2 text-sm">
                {["24H", "7D", "30D"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 rounded-full transition ${
                      range === r
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-gray-300 hover:bg-white/20"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* CHART */}
            <div className="h-72 min-h-[288px]">
              <ResponsiveContainer width="100%" aspect={3}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis
                    stroke="#6b7280"
                    ticks={[0, 20000, 40000, 60000, 80000]}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(v) => `₹${Number(v).toLocaleString("en-IN")}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ec4899"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RISK ALERTS (REAL DATA COMES FROM YOUR RISK PAGE) */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">⚠ Risk Alerts</h2>
              <a href="/risk-alerts" className="text-sm text-blue-400">
                View All
              </a>
            </div>

            {dashboardRiskAlerts.map((coin) => (
              <div
                key={coin.id}
                className={`mb-3 p-4 rounded-xl border ${
                  coin.risk === "HIGH"
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-yellow-400/10 border-yellow-400/30"
                }`}
              >
                <div className="flex justify-between">
                  <span className="font-semibold">
                    {coin.symbol.toUpperCase()}
                  </span>
                  <span className="text-xs">{coin.risk} RISK</span>
                </div>

                <p className="text-sm text-gray-400">
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
                <p className="text-xs text-gray-500">
                  Market Cap: ₹{Math.round(coin.market_cap / 1e7)} Cr
                </p>
              </div>
            ))}
          </div>
          {/* ================= ASSET BREAKDOWN ================= */}
          <div className="mt-12 col-span-3 w-full">
            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-1">
                Asset Breakdown
              </h2>
              <p className="text-gray-400 mb-8">
                Detailed view of your holdings
              </p>

              {/* HEADER ROW */}
              <div className="hidden lg:grid grid-cols-12 gap-4 text-xs text-gray-400 mb-3 px-4">
                <div className="col-span-3">Asset</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Avg Cost</div>
                <div className="col-span-2">Current Price</div>
                <div className="col-span-3 text-right">Total Value</div>
              </div>

              <div className="space-y-4">
                {holdings.map((h) => {
                  const coin = pricing.find((p) => p.symbol === h.symbol);
                  const livePrice = coin?.priceUsd || 0;
                  const totalValue = h.quantity * livePrice;

                  return (
                    <div
                      key={h.id}
                      className="
            grid grid-cols-1 lg:grid-cols-12
            gap-4
            items-center
            px-4 py-5
            rounded-xl
            bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-purple-900/40
            border border-purple-500/20
            hover:border-pink-500/40
            transition-all
          "
                    >
                      {/* ASSET */}
                      <div className="lg:col-span-3 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/45 to-purple-600 flex items-center justify-center font-bold">
                          {h.symbol}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {h.symbol}
                          </div>
                          <div className="text-xs text-gray-400">
                            Exchange: Binance
                          </div>
                        </div>
                      </div>

                      {/* QUANTITY */}
                      <div className="lg:col-span-2 text-white font-medium">
                        {h.quantity}
                      </div>

                      {/* AVG COST */}
                      <div className="lg:col-span-2 text-white font-medium">
                        ₹{Number(h.price).toLocaleString("en-IN")}
                      </div>

                      {/* CURRENT PRICE */}
                      <div className="lg:col-span-2 text-pink-400 font-medium">
                        ₹{Number(livePrice).toLocaleString("en-IN")}
                        <span className="ml-2 text-xs text-green-400">
                          LIVE
                        </span>
                      </div>

                      {/* TOTAL VALUE */}
                      <div className="lg:col-span-3 text-right text-green-400 font-bold text-lg">
                        ₹{Number(totalValue).toLocaleString("en-IN")}
                      </div>
                    </div>
                  );
                })}

                {holdings.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    No holdings yet — add trades to see positions
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* TRADES SECTION */}
        <div className="mt-12 w-full">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-1">
              Recent Trades
            </h2>
            <p className="text-gray-400 mb-8">Your latest trades</p>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                  <th className="pb-4">Asset</th>
                  <th className="pb-4">Side</th>
                  <th className="pb-4">Quantity</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {trades.slice(0, 5).map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="py-4 font-semibold">{t.assetSymbol}</td>
                    <td
                      className={`font-semibold ${t.side === "BUY" ? "text-green-400" : "text-red-400"}`}
                    >
                      {t.side}
                    </td>
                    <td>{t.quantity}</td>
                    <td>₹{Number(t.price).toLocaleString("en-IN")}</td>
                    <td>{new Date(t.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* P&L SECTION */}
        {pnl && (
          <div className="mt-12 w-full">
            <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-1">
                P&L Summary
              </h2>
              <p className="text-gray-400 mb-8">Profit and Loss overview</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
                  <p className="text-gray-400 text-sm mb-1">Unrealized P&L</p>
                  <p className="text-xl font-bold text-green-400">
                    ₹{pnl.totalUnrealizedPnL.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <p className="text-gray-400 text-sm mb-1">Realized P&L</p>
                  <p className="text-xl font-bold text-red-400">
                    ₹{pnl.totalRealizedPnL.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS SECTION */}
        <div className="mt-12 w-full">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-1">
              Notifications
            </h2>
            <p className="text-gray-400 mb-8">Recent notifications</p>
            <div className="space-y-4">
              {notifications.slice(0, 5).map((n) => (
                <div
                  key={n.id}
                  className="bg-white/5 p-4 rounded-lg border border-white/10"
                >
                  <p className="text-white">{n.message}</p>
                  <p className="text-gray-400 text-sm">
                    {new Date(n.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PRICING SECTION */}
        <div className="mt-12 w-full">
          <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-1">Pricing</h2>
            <p className="text-gray-400 mb-8">Current prices</p>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                  <th className="pb-4">Symbol</th>
                  <th className="pb-4">Price</th>
                  <th className="pb-4">Change %</th>
                  <th className="pb-4">7D </th>
                </tr>
              </thead>
              <tbody>
                {pricing.slice(0, 10).map((p) => (
                  <tr
                    key={p.symbol}
                    className="border-b border-white/5 hover:bg-white/5 transition-all"
                  >
                    <td className="py-4 font-semibold">{p.symbol}</td>
                    <td>${Number(p.priceUsd).toLocaleString("en-IN")}</td>
                    <td
                      className={`font-semibold ${
                        p.change24h >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {p.change24h.toFixed(2)}%
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
        </div>
      </div>
      {/* ===== FLOATING AI ASSISTANT (BOTTOM-RIGHT) ===== */}
      <AIAssistant />
    </DashboardLayout>
  );
}

/* ---------------- UI COMPONENT ---------------- */

function SummaryCard({ title, value, sub, gradient }) {
  return (
    <div
      className={`rounded-2xl p-6 bg-gradient-to-br ${gradient} border border-white/10`}
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      {sub && <p className="text-gray-400 text-sm mt-1">{sub}</p>}
    </div>
  );
}
