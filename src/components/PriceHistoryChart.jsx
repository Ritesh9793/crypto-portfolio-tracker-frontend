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

export default function PriceHistoryChart({ asset }) {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1D");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asset) return;

    setLoading(true);

    fetch(`http://localhost:8080/api/prices/history/${asset}?range=${range}`)
      .then((res) => res.json())
      .then((resData) => {
        const formatted = resData.map((d) => ({
          time: new Date(d.time).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: Number(d.price),
        }));
        setData(formatted);
      })
      .catch((err) => {
        console.error("Price history error", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [asset, range]);

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">📈 {asset} Price History</h2>

        {/* RANGE SELECTOR */}
        <div className="flex gap-2">
          {["1D", "7D", "1M"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`
                px-4 py-1.5 rounded-full text-sm font-semibold
                transition-all
                ${
                  range === r
                    ? "bg-green-500 text-black"
                    : "bg-slate-800 text-gray-300 hover:bg-slate-700"
                }
              `}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-400 text-center py-10">
          Loading price history...
        </p>
      ) : data.length === 0 ? (
        <p className="text-gray-400 text-center py-10">
          No historical data available
        </p>
      ) : (
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="time" stroke="#aaa" />
              <YAxis
                stroke="#aaa"
                domain={["dataMin - 100", "dataMax + 100"]}
              />
              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
