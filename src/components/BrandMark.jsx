import { Link } from "react-router-dom";

export default function BrandMark({
  to = "/",
  compact = false,
  className = "",
}) {
  const content = (
    <div className={`flex items-center gap-3 ${className}`.trim()}>
      <img
        src="/brand-logo.png"
        alt="Crypto Portfolio Tracker"
        className={compact ? "h-10 w-10 rounded-2xl" : "h-14 w-14 rounded-3xl"}
      />

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[#e2b768]">
          Risk and Scam Detection
        </p>
        <h1
          className={`font-semibold tracking-[-0.03em] text-[#f7f2e8] ${
            compact ? "text-base" : "text-lg"
          }`}
        >
          Crypto Portfolio Tracker
        </h1>
      </div>
    </div>
  );

  if (!to) {
    return content;
  }

  return (
    <Link to={to} className="inline-flex items-center">
      {content}
    </Link>
  );
}
