import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const supportedExchanges = [
  { value: "BINANCE", label: "Binance", baseUrl: "https://api.binance.com" },
  { value: "COINBASE", label: "Coinbase", baseUrl: "https://api.coinbase.com" },
  { value: "KRAKEN", label: "Kraken", baseUrl: "https://api.kraken.com" },
  { value: "OKX", label: "OKX", baseUrl: "https://www.okx.com" },
];

const SettingsExchanges = () => {
  const [exchange, setExchange] = useState("BINANCE");
  const [connections, setConnections] = useState([]);
  const [balances, setBalances] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [label, setLabel] = useState("Primary trading account");
  const [baseUrl, setBaseUrl] = useState("https://api.binance.com");
  const [loading, setLoading] = useState(false);

  const loadConnections = async () => {
    try {
      const res = await api.get("/api/exchange-accounts");
      setConnections(res.data || []);
    } catch {
      setConnections([]);
    }
  };

  useEffect(() => {
    loadConnections();
  }, []);

  const handleExchangeChange = (value) => {
    setExchange(value);
    const selected = supportedExchanges.find((item) => item.value === value);
    setBaseUrl(selected?.baseUrl || "");
    setLabel(`${selected?.label || value} Primary`);
  };

  const syncBalance = async () => {
    try {
      const res = await api.get(`/api/exchange-accounts/sync/${exchange.toLowerCase()}`);
      setBalances(res.data?.balances || []);
      toast.success("Tracked balances synced");
    } catch {
      toast.error("Failed to sync tracked balances");
    }
  };

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !label) {
      toast.error("Exchange label, API key, and API secret are required");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/exchange-accounts", {
        exchange,
        label,
        baseUrl,
        apiKey,
        apiSecret,
      });

      toast.success("Exchange connected securely");
      setApiKey("");
      setApiSecret("");
      await loadConnections();
    } catch {
      toast.error("Failed to connect exchange");
    } finally {
      setLoading(false);
    }
  };

  const disconnectExchange = async (exchangeName) => {
    const confirmed = window.confirm(`Disconnect ${exchangeName}?`);
    if (!confirmed) return;

    try {
      await api.delete(`/api/exchange-accounts/${exchangeName}`);
      toast.success("Exchange disconnected");
      setBalances([]);
      await loadConnections();
    } catch {
      toast.error("Failed to disconnect exchange");
    }
  };

  return (
    <div className="max-w-7xl space-y-5 text-white">
      <h2 className="p-3 text-xl rounded font-semibold bg-pink-500 text-center">
        Connect Exchange
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        <select
          value={exchange}
          onChange={(e) => handleExchangeChange(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white"
        >
          {supportedExchanges.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <input
          placeholder="Connection label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full p-3 rounded bg-slate-800 text-white"
        />
      </div>

      <input
        placeholder="Exchange base URL"
        value={baseUrl}
        onChange={(e) => setBaseUrl(e.target.value)}
        className="w-full p-3 rounded bg-slate-800 text-white"
      />

      <input
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="w-full p-3 rounded bg-slate-800 text-white"
      />

      <input
        type="password"
        placeholder="API Secret"
        value={apiSecret}
        onChange={(e) => setApiSecret(e.target.value)}
        className="w-full p-3 rounded bg-slate-800 text-white"
      />

      <p className="text-sm text-gray-400">
        Exchange credentials are encrypted at rest on the backend and returned as masked values only.
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full text-lg font-semibold bg-pink-500 py-3 rounded text-white"
        >
          {loading ? "Connecting..." : "Add Exchange"}
        </button>

        <button
          onClick={syncBalance}
          className="w-full text-lg font-semibold bg-slate-700 py-3 rounded text-white"
        >
          Sync Tracked Balances
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <h3 className="text-lg font-semibold mb-4">Connected Exchanges</h3>
          {connections.length === 0 ? (
            <p className="text-sm text-gray-400">No exchange connections saved yet.</p>
          ) : (
            <div className="space-y-3">
              {connections.map((connection) => (
                <div
                  key={connection.id}
                  className="rounded-xl border border-slate-800 bg-black/40 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold">{connection.exchange}</div>
                      <div className="text-sm text-gray-400">{connection.label}</div>
                      <div className="text-xs text-gray-500">{connection.baseUrl || "No base URL"}</div>
                      <div className="text-xs text-gray-500">Key: {connection.maskedApiKey || "masked"}</div>
                    </div>
                    <button
                      onClick={() => disconnectExchange(connection.exchange)}
                      className="px-3 py-2 rounded bg-red-500/20 text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <h3 className="text-lg font-semibold mb-4">Synced Balances</h3>
          {balances.length === 0 ? (
            <p className="text-sm text-gray-400">No tracked balances available for this exchange yet.</p>
          ) : (
            <div className="space-y-3">
              {balances.map((balance) => (
                <div
                  key={balance.asset}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-black/40 px-4 py-3"
                >
                  <div>
                    <div className="font-semibold">{balance.asset}</div>
                    <div className="text-xs text-gray-500">Locked: {balance.locked}</div>
                  </div>
                  <div className="text-green-400 font-semibold">{balance.free}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsExchanges;
