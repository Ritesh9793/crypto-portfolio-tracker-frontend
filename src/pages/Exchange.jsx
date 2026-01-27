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
        <div className="p-10 text-gray-400">Please log in or try demo.</div>
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
      await api.post("/api/trades", {
        symbol,
        quantity: parseFloat(quantity),
        price: parseFloat(price),
        type,
      });
      toast.success(`${type} order placed successfully!`);
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
      <div className="p-6 min-h-screen text-white bg-gradient-to-br from-black via-[#06010d] to-black">
        <h1 className="text-2xl font-semibold mb-6">Exchange</h1>
        {isDemo && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300">
            Demo mode: Trading disabled
          </div>
        )}

        <div className="max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setType("BUY")}
              className={`py-3 rounded-lg font-semibold transition ${
                type === "BUY"
                  ? "bg-green-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              BUY
            </button>
            <button
              onClick={() => setType("SELL")}
              className={`py-3 rounded-lg font-semibold transition ${
                type === "SELL"
                  ? "bg-red-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              SELL
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Cryptocurrency
              </label>
              <select
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="XRP">Ripple (XRP)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-500"
                disabled={isDemo}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-pink-500"
                disabled={isDemo}
              />
            </div>

            <button
              onClick={handleTrade}
              disabled={loading || isDemo}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isDemo
                  ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                  : "bg-pink-500 text-white hover:bg-pink-600"
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

export default Exchange;
