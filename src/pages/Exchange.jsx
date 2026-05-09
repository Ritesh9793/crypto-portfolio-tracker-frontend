import { useContext, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { DemoContext } from "../context/DemoContext";
import DashboardLayout from "../layout/DashboardLayout";

const Exchange = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { isDemo } = useContext(DemoContext);
  const [symbol, setSymbol] = useState("BTC");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("BUY");
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated && !isDemo) {
    return (
      <DashboardLayout>
        <div className="app-page text-[#cbbca5]">Please log in or try demo.</div>
      </DashboardLayout>
    );
  }

  const handleTrade = async () => {
    if (isDemo) {
      toast.error("Demo mode: Trading disabled");
      return;
    }

    if (!quantity || !price) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/trades/add-trade", {
        assetSymbol: symbol,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        fee: 0,
        exchange: "BINANCE",
        side: type,
      });
      toast.success(`${type} order placed successfully`);
      setQuantity("");
      setPrice("");
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="app-page">
        <div className="page-header">
          <div>
            <span className="page-kicker">Manual trade entry</span>
            <h2 className="page-title">Create a quick exchange order</h2>
            <p className="page-subtitle">
              Submit simple buy or sell entries directly from the app when you need
              manual control.
            </p>
          </div>
        </div>

        {isDemo && (
          <div className="mb-6 rounded-2xl border border-[rgba(250,204,21,0.18)] bg-[rgba(113,63,18,0.14)] p-4 text-sm text-[#fde68a]">
            Demo mode: trading is disabled.
          </div>
        )}

        <div className="max-w-3xl app-card p-8">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setType("BUY")}
              className={`rounded-2xl px-4 py-3 font-semibold transition ${
                type === "BUY"
                  ? "bg-[rgba(34,197,94,0.14)] text-[#86efac]"
                  : "bg-[rgba(255,248,236,0.03)] text-[#cbbca5]"
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => setType("SELL")}
              className={`rounded-2xl px-4 py-3 font-semibold transition ${
                type === "SELL"
                  ? "bg-[rgba(239,68,68,0.14)] text-[#fca5a5]"
                  : "bg-[rgba(255,248,236,0.03)] text-[#cbbca5]"
              }`}
            >
              SELL
            </button>
          </div>

          <div className="mt-6 space-y-5">
            <Field label="Cryptocurrency">
              <select
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
                className="app-select px-4 py-3"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="XRP">Ripple (XRP)</option>
              </select>
            </Field>

            <Field label="Quantity">
              <input
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
                placeholder="Enter quantity"
                className="app-input px-4 py-3"
                disabled={isDemo}
              />
            </Field>

            <Field label="Price (INR)">
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter price"
                className="app-input px-4 py-3"
                disabled={isDemo}
              />
            </Field>

            <button
              onClick={handleTrade}
              disabled={loading || isDemo}
              className={`app-button-primary w-full px-6 py-3 ${
                loading || isDemo ? "cursor-not-allowed opacity-60" : ""
              }`}
            >
              {loading ? "Processing..." : `${type} ${symbol}`}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#cbbca5]">{label}</label>
      {children}
    </div>
  );
}

export default Exchange;
