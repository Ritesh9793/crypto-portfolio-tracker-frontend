export const HighRiskTrend = () => (
  <svg width="64" height="32" viewBox="0 0 64 32">
    <polyline
      points="2,6 18,18 32,10 46,22 62,28"
      fill="none"
      stroke="#ef4444"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="trend-line high"
    />
  </svg>
);

export const MediumRiskTrend = () => (
  <svg width="64" height="32" viewBox="0 0 64 32">
    <polyline
      points="2,16 18,10 32,18 46,12 62,16"
      fill="none"
      stroke="#facc15"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="trend-line medium"
    />
  </svg>
);

export const LowRiskTrend = () => (
  <svg width="64" height="32" viewBox="0 0 64 32">
    <polyline
      points="2,26 18,20 32,16 46,10 62,6"
      fill="none"
      stroke="#22c55e"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="trend-line low"
    />
  </svg>
);
