import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const SettingsExchanges = () => {
  const [exchange, setExchange] = useState("BINANCE");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error("API key & secret required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await api.post(
        "/api/add-exchange/exchanges",
        { exchange, apiKey, apiSecret },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Exchange connected");
      setApiKey("");
      setApiSecret("");
    } catch {
      toast.error("Failed to connect exchange");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md space-y-5">
      <h2 className="text-xl rounded font-semibold bg-pink-500 text-white text-center">Connect Exchange</h2>

      <select
        value={exchange}
        onChange={(e) => setExchange(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 bg-repeat-round text-white hover:cursor-pointer"
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
    </div>
  );
};

export default SettingsExchanges;
