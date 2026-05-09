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
import api from "../api/axios";

export default function PriceHistoryChart({ asset }) {
  const [data, setData] = useState([]);
  const [range, setRange] = useState("1D");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!asset) return;

    setLoading(true);

    api
      .get(`/api/prices/history/${asset}`, {
        params: { range },
      })
      .then((res) => {
        const formatted = (res.data || []).map((point) => ({
          time: new Date(point.time).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: Number(point.price),
        }));
        setData(formatted);
      })
      .catch((error) => {
        console.error("Price history error", error);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, [asset, range]);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#f7f2e8]">{asset} price history</h3>
          <p className="mt-2 text-sm text-[#9d8c73]">Historical movement across the selected range.</p>
        </div>

        <div className="flex gap-2">
          {["1D", "7D", "1M"].map((item) => (
            <button
              key={item}
              onClick={() => setRange(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                range === item
                  ? "bg-[rgba(211,155,52,0.14)] text-[#f7f2e8]"
                  : "bg-[rgba(255,248,236,0.03)] text-[#cbbca5]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="py-10 text-center text-[#9d8c73]">Loading price history...</p>
      ) : data.length === 0 ? (
        <p className="py-10 text-center text-[#9d8c73]">No historical data available.</p>
      ) : (
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(203,188,165,0.12)" />
              <XAxis dataKey="time" stroke="#9d8c73" />
              <YAxis stroke="#9d8c73" domain={["dataMin - 100", "dataMax + 100"]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#22170a",
                  border: "1px solid rgba(226, 183, 104, 0.16)",
                  borderRadius: "14px",
                }}
                formatter={(value) => `Rs${Number(value).toLocaleString("en-IN")}`}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#d39b34"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5, fill: "#d39b34" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
