export default function Sparkline({ data, positive }) {
  if (!Array.isArray(data) || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = ((max - value) / (max - min || 1)) * 40;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width="120" height="40" viewBox="0 0 100 40">
      <polyline
        fill="none"
        stroke={positive ? "#4ade80" : "#f87171"}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
