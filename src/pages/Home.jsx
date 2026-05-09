import { ArrowRight, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import BrandMark from "../components/BrandMark";

const capabilities = [
  {
    title: "Portfolio visibility",
    description:
      "Track holdings, trades, allocation, and live pricing in one streamlined dashboard.",
    icon: Wallet,
  },
  {
    title: "Risk and scam analysis",
    description:
      "Review volatility, market-cap risk, and flagged assets before they affect portfolio decisions.",
    icon: ShieldCheck,
  },
  {
    title: "Reports and guidance",
    description:
      "Export P&L data, review tax hints, connect exchanges, and use the AI assistant for faster analysis.",
    icon: Sparkles,
  },
];

const metrics = [
  { label: "Core workflows", value: "8+" },
  { label: "Analytics surfaces", value: "Live pricing, P&L, risk" },
  { label: "Built for", value: "Investors and student projects" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#120d08] px-4 py-6 text-[#f7f2e8] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[rgba(226,183,104,0.12)] bg-[linear-gradient(180deg,rgba(34,23,10,0.96),rgba(18,13,8,0.98))] shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
        <header className="border-b border-[rgba(226,183,104,0.1)] px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <BrandMark />
            <nav className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="rounded-full border border-[rgba(226,183,104,0.18)] px-5 py-2 text-sm font-medium text-[#f7f2e8] transition hover:border-[rgba(226,183,104,0.34)] hover:bg-[rgba(255,248,236,0.04)]"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#d39b34,#915b0a)] px-5 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(145,91,10,0.3)] transition hover:-translate-y-0.5"
              >
                Create account
                <ArrowRight size={16} />
              </Link>
            </nav>
          </div>
        </header>

        <main className="px-6 py-10 sm:px-8 sm:py-12">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:items-center">
            <div>
              <span className="app-badge">Minimal interface. Full portfolio context.</span>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-[#f7f2e8] sm:text-5xl lg:text-6xl">
                A cleaner way to track crypto, monitor risk, and explain decisions.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#cbbca5] sm:text-lg">
                Crypto Portfolio Tracker brings portfolio monitoring, live pricing,
                risk alerts, scam-focused review, exchange connectivity, and
                reporting into one focused workspace. It is built to help users
                understand both performance and exposure without digging through
                disconnected tools.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/login" className="app-button-primary px-6 py-3">
                  Open workspace
                </Link>
                <Link
                  to="/register"
                  className="app-button-secondary px-6 py-3 text-sm font-semibold"
                >
                  Start with a new account
                </Link>
              </div>
            </div>

            <div className="app-card p-6 sm:p-8">
              <div className="grid gap-4">
                {metrics.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.35rem] border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] p-5"
                  >
                    <p className="text-sm uppercase tracking-[0.18em] text-[#9d8c73]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-12 grid gap-5 lg:grid-cols-3">
            {capabilities.map(({ title, description, icon: Icon }) => (
              <article key={title} className="app-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgba(211,155,52,0.12)] text-[#d39b34]">
                  <Icon size={22} />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#f7f2e8]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#cbbca5]">
                  {description}
                </p>
              </article>
            ))}
          </section>

          <section className="mt-12 grid gap-6 rounded-[1.75rem] border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] p-6 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <div>
              <p className="page-kicker">Project flow</p>
              <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[#f7f2e8]">
                From data collection to action.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#cbbca5]">
                Users can record or sync trades, review holdings and allocation,
                inspect price history, classify market risk, and export financial
                reporting without leaving the product. The interface is designed
                to stay focused even as the analysis gets deeper.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "Connect accounts or add trades manually.",
                "Monitor holdings, performance, and live market pricing.",
                "Review risk alerts, tax hints, and AI-assisted explanations.",
              ].map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.25rem] border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d39b34]">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#f7f2e8]">{step}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
