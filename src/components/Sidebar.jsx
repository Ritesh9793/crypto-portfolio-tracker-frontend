import { useState } from "react";
import {
  MdAccountBalanceWallet,
  MdAccountCircle,
  MdAssessment,
  MdClose,
  MdCurrencyExchange,
  MdDashboard,
  MdLogout,
  MdMenu,
  MdPriceCheck,
  MdTrendingUp,
  MdWarning,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BrandMark from "./BrandMark";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: MdDashboard },
  { name: "Holdings", path: "/holdings", icon: MdAccountBalanceWallet },
  { name: "Trades", path: "/trades", icon: MdTrendingUp },
  { name: "Pricing", path: "/pricing", icon: MdPriceCheck },
  { name: "Risk Alerts", path: "/risk-alerts", icon: MdWarning },
  { name: "P&L Reports", path: "/pnl-reports", icon: MdAssessment },
  { name: "Add Exchange", path: "/add-exchange", icon: MdCurrencyExchange },
  { name: "Profile", path: "/profile", icon: MdAccountCircle },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  return (
    <aside
      className={`flex min-h-screen flex-shrink-0 flex-col border-r border-[rgba(226,183,104,0.08)] bg-[rgba(16,12,8,0.88)] backdrop-blur-xl transition-all duration-300 ${
        isOpen ? "w-72 px-5 py-5" : "w-24 px-3 py-5"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        {isOpen ? (
          <BrandMark compact to="/dashboard" />
        ) : (
          <Link to="/dashboard" className="mx-auto">
            <img
              src="/brand-logo.png"
              alt="Crypto Portfolio Tracker"
              className="h-11 w-11 rounded-2xl"
            />
          </Link>
        )}

        <button
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-2xl border border-[rgba(226,183,104,0.14)] bg-[rgba(255,248,236,0.03)] p-2 text-[#cbbca5] transition hover:text-[#f7f2e8]"
        >
          {isOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
        </button>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-2xl px-3 py-3 transition-all ${
                active
                  ? "border border-[rgba(211,155,52,0.24)] bg-[rgba(211,155,52,0.12)] text-[#f7f2e8]"
                  : "border border-transparent text-[#cbbca5] hover:border-[rgba(226,183,104,0.12)] hover:bg-[rgba(255,248,236,0.03)] hover:text-[#f7f2e8]"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl ${
                  active
                    ? "bg-[rgba(255,248,236,0.08)] text-[#e2b768]"
                    : "bg-[rgba(255,248,236,0.03)]"
                }`}
              >
                <Icon size={21} />
              </div>
              {isOpen && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 space-y-3">
        {isOpen && (
          <div className="rounded-[1.35rem] border border-[rgba(226,183,104,0.1)] bg-[rgba(255,248,236,0.03)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#d39b34]">
              Workspace mode
            </p>
            <p className="mt-2 text-sm leading-6 text-[#cbbca5]">
              Minimal portfolio operations with live risk context.
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[rgba(239,68,68,0.18)] bg-[rgba(127,29,29,0.12)] px-3 py-3 text-[#fca5a5] transition hover:bg-[rgba(127,29,29,0.2)]"
        >
          <MdLogout size={20} />
          {isOpen && <span className="text-sm font-semibold">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
