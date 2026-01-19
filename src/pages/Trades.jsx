import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function Trades() {
  const [trades, setTrades] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [sellError, setSellError] = useState(null);

  const [formData, setFormData] = useState({
    assetSymbol: "",
    side: "BUY",
    quantity: "",
    price: "",
    fee: "",
  });

  /* ---------------- FETCH TRADES ---------------- */
  const fetchTrades = async () => {
    try {
      const res = await api.get("/trades");
      setTrades(res.data || []);
    } catch (err) {
      console.error("Error loading trades", err);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  /* ---------------- FORMAT INR ---------------- */
  const formatINR = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  /* ---------------- BUY vs SELL GRAPH DATA ---------------- */
  const getBuySellChartData = () => {
    const map = {};

    trades.forEach((t) => {
      if (!map[t.assetSymbol]) {
        map[t.assetSymbol] = {
          asset: t.assetSymbol,
          buy: 0,
          sell: 0,
        };
      }

      if (t.side === "BUY") {
        map[t.assetSymbol].buy += Number(t.quantity);
      } else {
        map[t.assetSymbol].sell += Number(t.quantity);
      }
    });

    return Object.values(map);
  };

  /* ---------------- AVAILABLE QTY CALC ---------------- */
  const getAvailableQuantity = (asset, editingTradeId = null) => {
    let buy = 0;
    let sell = 0;

    trades.forEach((t) => {
      if (t.assetSymbol !== asset) return;
      if (editingTradeId && t.id === editingTradeId) return;

      if (t.side === "BUY") buy += Number(t.quantity);
      if (t.side === "SELL") sell += Number(t.quantity);
    });

    return buy - sell;
  };

  /* ---------------- OPEN ADD MODAL ---------------- */
  const openAddModal = () => {
    setEditing(null);
    setFormData({
      assetSymbol: "",
      side: "BUY",
      quantity: "",
      price: "",
      fee: "",
    });
    setIsModalOpen(true);
  };

  /* ---------------- SAVE / UPDATE ---------------- */
  const handleSave = async () => {
    try {
      const qty = Number(formData.quantity);

      // 🚨 SELL VALIDATION
      if (formData.side === "SELL") {
        const availableQty = getAvailableQuantity(
          formData.assetSymbol,
          editing?.id,
        );

        if (qty > availableQty) {
          setSellError({
            asset: formData.assetSymbol,
            available: availableQty,
            attempting: qty,
          });
          return;
        }
      }

      const payload = {
        ...formData,
        quantity: qty,
        price: Number(formData.price),
        fee: Number(formData.fee),
      };

      if (editing) {
        await api.put(`/trades/${editing.id}`, payload);
      } else {
        await api.post("/trades", payload);
      }

      setIsModalOpen(false);
      fetchTrades();
    } catch (err) {
      console.error("Error saving trade", err);
      alert(err?.response?.data || "Unable to save trade");
    }
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async () => {
    try {
      await api.delete(`/trades/${showDeletePopup.id}`);
      setShowDeletePopup(null);
      fetchTrades();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">
        {/* TITLE */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold tracking-wide">Trades Overview</h1>

          <button
            onClick={openAddModal}
            className="px-6 py-3 rounded-xl font-semibold neon-button"
          >
            + Add Trade
          </button>
        </div>

        {/* TABLE */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-300 border-b border-white/10 uppercase text-sm">
                <th className="pb-4">Asset</th>
                <th className="pb-4">Side</th>
                <th className="pb-4">Quantity</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Fee</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {trades.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400">
                    No trades yet — add your first trade
                  </td>
                </tr>
              )}

              {trades.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-all group"
                >
                  <td className="py-4 font-semibold">{t.assetSymbol}</td>

                  <td
                    className={`font-semibold ${
                      t.side === "BUY" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.side}
                  </td>

                  <td>{t.quantity}</td>

                  <td className="text-green-400">{formatINR(t.price)}</td>

                  <td>{t.fee}</td>

                  <td className="text-right opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => {
                        setEditing(t);
                        setFormData({
                          assetSymbol: t.assetSymbol,
                          side: t.side,
                          quantity: t.quantity,
                          price: t.price,
                          fee: t.fee,
                        });
                        setIsModalOpen(true);
                      }}
                      className="px-4 py-2 text-sm rounded-lg edit-btn mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setShowDeletePopup(t)}
                      className="px-4 py-2 text-sm rounded-lg delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* BUY vs SELL GRAPH */}
        {trades.length > 0 && (
          <div className="glass-card p-6 mt-10 rounded-2xl border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-6 neon-text">
              Buy vs Sell Overview
            </h2>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={getBuySellChartData()}>
                  <XAxis dataKey="asset" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  />
                  <Legend />

                  <Bar
                    dataKey="buy"
                    fill="#22c55e"
                    name="BUY Quantity"
                    activeBar={{
                      fill: "#22c55e",
                      stroke: "#22c55e",
                      strokeWidth: 2,
                      filter: "drop-shadow(0 0 8px #22c55e)",
                    }}
                  />

                  <Bar
                    dataKey="sell"
                    fill="#ef4444"
                    name="SELL Quantity"
                    activeBar={{
                      fill: "#ef4444",
                      stroke: "#ef4444",
                      strokeWidth: 2,
                      filter: "drop-shadow(0 0 8px #ef4444)",
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ADD / EDIT MODAL */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-box">
              <h2 className="text-2xl font-bold mb-6 neon-text">
                {editing ? "Edit Trade" : "Add Trade"}
              </h2>

              <div className="flex flex-col gap-4">
                <input
                  className="cyber-input"
                  placeholder="Asset (BTC)"
                  value={formData.assetSymbol}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      assetSymbol: e.target.value.toUpperCase(),
                    })
                  }
                />

                <select
                  className="cyber-input bg-slate-900 text-white"
                  value={formData.side}
                  onChange={(e) =>
                    setFormData({ ...formData, side: e.target.value })
                  }
                >
                  <option value="BUY" className="bg-slate-900 text-green-400">
                    BUY
                  </option>
                  <option value="SELL" className="bg-slate-900 text-red-400">
                    SELL
                  </option>
                </select>

                <input
                  className="cyber-input"
                  type="number"
                  placeholder="Quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                />

                <input
                  className="cyber-input"
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />

                <input
                  className="cyber-input"
                  type="number"
                  placeholder="Fee"
                  value={formData.fee}
                  onChange={(e) =>
                    setFormData({ ...formData, fee: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>

                <button onClick={handleSave} className="save-btn">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SELL ERROR POPUP */}
        {sellError && (
          <div className="modal-overlay">
            <div className="modal-box border border-red-500">
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                ⚠️ Invalid SELL Trade
              </h2>

              <p className="text-gray-300 mb-6">
                You are trying to SELL <b>{sellError.attempting}</b>{" "}
                {sellError.asset}, but you only own <b>{sellError.available}</b>
                .
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setSellError(null)}
                  className="save-btn bg-red-500 hover:bg-red-600"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION */}
        {showDeletePopup && (
          <div className="modal-overlay">
            <div className="delete-box">
              <h3 className="text-xl font-semibold mb-4">Delete Trade?</h3>

              <p className="text-gray-300 mb-6">
                Are you sure you want to delete{" "}
                <b>{showDeletePopup.assetSymbol}</b> trade?
              </p>

              <div className="flex justify-end gap-4">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeletePopup(null)}
                >
                  Cancel
                </button>

                <button className="delete-btn px-6 py-2" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
