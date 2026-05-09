import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";

const defaultHighlights = [
  {
    title: "Track the full portfolio",
    description:
      "Monitor holdings, trades, allocation, and live pricing from a single workspace.",
  },
  {
    title: "Review risk in context",
    description:
      "Classify volatile assets quickly with built-in risk alerts and scam analysis cues.",
  },
  {
    title: "Act with clarity",
    description:
      "Use P&L insights, tax hints, exchange sync, and the AI assistant without leaving the app.",
  },
];

export default function AuthShell({
  badge = "Crypto portfolio operations",
  title,
  description,
  children,
  highlights = defaultHighlights,
}) {
  return (
    <div className="min-h-screen bg-[#120d08] px-4 py-6 text-[#f7f2e8] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col overflow-hidden rounded-[2rem] border border-[rgba(226,183,104,0.12)] bg-[linear-gradient(180deg,rgba(34,23,10,0.96),rgba(18,13,8,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.35)] lg:flex-row">
        <section className="relative flex w-full flex-col justify-between border-b border-[rgba(226,183,104,0.1)] px-6 py-8 lg:w-[46%] lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(211,155,52,0.16),transparent_32%)]" />
          <div className="relative">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <BrandMark />
              <nav className="flex items-center gap-4 text-sm text-[#cbbca5]">
                <Link to="/" className="transition hover:text-[#f7f2e8]">
                  Home
                </Link>
                <Link to="/login" className="transition hover:text-[#f7f2e8]">
                  Login
                </Link>
                <Link to="/register" className="transition hover:text-[#f7f2e8]">
                  Register
                </Link>
              </nav>
            </div>

            <div className="mt-14">
              <span className="app-badge">{badge}</span>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#f7f2e8] sm:text-5xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[#cbbca5]">
                {description}
              </p>
            </div>
          </div>

          <div className="relative mt-10 grid gap-4">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.35rem] border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] p-5"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d39b34]">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#cbbca5]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-5 py-8 sm:px-6 lg:w-[54%] lg:px-10">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] p-6 shadow-[0_18px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
