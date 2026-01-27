import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const SettingsExchanges = () => {
  const [exchange, setExchange] = useState("BINANCE");
  const [balances, setBalances] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const syncBalance = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/api/exchange-accounts/sync/binance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const nonZeroBalances = res.data.balances.filter(
        (b) => Number(b.free) > 0 || Number(b.locked) > 0,
      );

      setBalances(nonZeroBalances);
      toast.success("Balance synced");
    } catch {
      toast.error("Failed to sync balance");
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await api.get("/api/exchange-accounts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const binanceConnected = res.data?.some(
      (acc) => acc.exchange === "BINANCE"
    );

    setIsConnected(binanceConnected);
  } catch (err) {
    // ✅ THIS IS EXPECTED WHEN NO EXCHANGE EXISTS
    console.warn("No exchange connected yet");
    setIsConnected(false);
  }
};


    checkConnection();
  }, []);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error("API key & secret required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.post(
        "/api/exchange-accounts",
        { exchange, apiKey, apiSecret },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Exchange connected");
      setIsConnected("true");
      setApiKey("");
      setApiSecret("");
    } catch {
      toast.error("Failed to connect exchange");
    } finally {
      setLoading(false);
    }
  };

  const disconnectExchange = async () => {
    const confirm = window.confirm(
      "Are you sure you want to disconnect Binance?",
    );

    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete("/api/exchange-accounts/BINANCE", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Exchange disconnected");
      setBalances([]);
      setIsConnected(false);
    } catch (err) {
      toast.error("Failed to disconnect exchange");
    }
  };

  return (
    <div className="max-w-7xl space-y-5">
      <h2 className="min-w-xl p-2 text-xl rounded font-semibold bg-pink-500 text-white text-center">
        Connect Exchange
      </h2>

      <select
        value={exchange}
        onChange={(e) => setExchange(e.target.value)}
        className="min-w-100 p-2 rounded bg-violet-400 bg-repeat-round text-white hover:cursor-pointer text-center"
      >
        <option value="BINANCE">Binance</option>
        <option value="COINBASE">Coinbase</option>
        <option value="WAZIRX">WazirX</option>
        <option value="KRAKEN">Kraken</option>
        <option value="BITFINEX">Bitfinex</option>
        <option value="HUOBI">Huobi</option>
        <option value="OKX">OKX</option>
        <option value="GATEIO">Gate.io</option>
        <option value="BITSTAMP">Bitstamp</option>
        <option value="POLONIEX">Poloniex</option>
        <option value="KUCOIN">KuCoin</option>
      </select>

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 text-white"
      />

      <input
        type="password"
        placeholder="API Secret"
        value={apiSecret}
        onChange={(e) => setApiSecret(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 text-white"
      />

      <button
        onClick={handleConnect}
        disabled={loading}
        className="w-full text-xl font-semibold bg-pink-500 py-2 rounded text-white"
      >
        {loading ? "Connecting..." : "Add Exchange"}
      </button>

      <button
        onClick={syncBalance}
        className="w-full text-lg font-semibold bg-slate-700 py-2 rounded text-white"
      >
        🔄 Sync Binance Balance
      </button>

      {/* Connected Exchange Card */}

      {isConnected && (
        <div className="mt-6 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900 to-black p-4 flex items-center gap-4">
          <img
            src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
            alt="Binance"
            className="h-10 w-10"
          />
          <div className="flex-1">
            <div className="text-white font-semibold">Binance Connected</div>
            <div className="text-xs text-gray-400">
              Spot wallet linked successfully
            </div>
          </div>
          <span className="text-green-400 text-sm font-semibold">● Active</span>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-black/80 p-4">
        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 border-b border-slate-700 pb-3 text-xs font-semibold uppercase text-gray-400">
          <div>Asset</div>
          <div>Quantity</div>
          <div>Avg Buy</div>
          <div>Live Price</div>
          <div>Total Value</div>
          <div className="text-right">Weight</div>
        </div>

        {/* Table Body */}
        {balances.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-500">
            No assets found in your Binance account
          </div>
        ) : (
          balances.map((b) => {
            const quantity = Number(b.free) + Number(b.locked);
            const totalValue = 0; // live price integration later
            const weight = 0;

            return (
              <div
                key={b.asset}
                className="grid grid-cols-6 gap-4 border-b border-slate-800 py-4 text-sm text-white"
              >
                {/* Asset */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                    {b.asset[0]}
                  </div>
                  <div>
                    <div className="font-medium">{b.asset}</div>
                    <div className="text-xs text-gray-400">{b.asset}</div>
                  </div>
                </div>

                {/* Quantity */}
                <div>{quantity.toFixed(6)}</div>

                {/* Avg Buy */}
                <div className="text-gray-400">—</div>

                {/* Live Price */}
                <div className="text-purple-400">
                  $0 <span className="text-green-400 text-xs">LIVE</span>
                </div>

                {/* Total Value */}
                <div className="font-semibold text-green-400">
                  ${totalValue}
                </div>

                {/* Weight */}
                <div className="text-right">{weight}%</div>
              </div>
            );
          })
        )}

        {/* Footer */}
        <div className="mt-4 flex justify-between text-sm text-gray-300">
          <span>Total Asset Value</span>
          <span className="font-semibold text-white">$0</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsExchanges;
