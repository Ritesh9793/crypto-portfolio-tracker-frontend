import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import NotificationBell from "../components/NotificationBell";
import Sidebar from "../components/Sidebar";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Portfolio overview, recent activity, and market visibility.",
  },
  "/holdings": {
    title: "Holdings",
    description: "Allocation, weight, and current value of each asset.",
  },
  "/trades": {
    title: "Trades",
    description:
      "Manage buy and sell activity without losing audit visibility.",
  },
  "/pricing": {
    title: "Pricing",
    description: "Live prices, market movement, and asset history.",
  },
  "/risk-alerts": {
    title: "Risk Alerts",
    description: "Review volatile assets and risk classifications quickly.",
  },
  "/pnl-reports": {
    title: "P&L Reports",
    description: "Track realized and unrealized returns with export support.",
  },
  "/profile": {
    title: "Profile",
    description: "Manage account details and workspace access.",
  },
  "/add-exchange": {
    title: "Exchange Setup",
    description: "Connect exchange accounts and sync balances.",
  },
  "/exchange": {
    title: "Exchange",
    description: "Place simple buy and sell entries from the app.",
  },
};

export default function DashboardLayout({ children }) {
  const location = useLocation();

  const meta = useMemo(
    () =>
      pageMeta[location.pathname] || {
        title: "Workspace",
        description: "Portfolio operations and analysis.",
      },
    [location.pathname],
  );

  return (
    <div className="app-shell flex min-h-screen text-[#f7f2e8]">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 border-b border-[rgba(226,183,104,0.08)] bg-[rgba(18,13,8,0.86)] px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d39b34]">
                Portfolio workspace
              </p>
              <h1 className="mt-1 truncate text-xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                {meta.title}
              </h1>
              <p className="mt-1 hidden text-sm text-[#9d8c73] sm:block">
                {meta.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden rounded-full border border-[rgba(226,183,104,0.14)] bg-[rgba(255,248,236,0.03)] px-4 py-2 text-xs font-medium text-[#cbbca5] sm:block">
                Risk and Scam Detection
              </div>
              <NotificationBell />
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
