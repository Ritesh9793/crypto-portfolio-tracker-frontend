import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const SettingsExchanges = () => {
  const [exchange, setExchange] = useState("BINANCE");
  const [connectedExchange, setConnectedExchange] = useState(null);
  const [balances, setBalances] = useState([]);
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const syncBalance = async () => {
    try {
      const token = localStorage.getItem("token");
      const exchangeToSync = (connectedExchange || exchange).toLowerCase();
      const res = await api.get(`/api/exchange-accounts/sync/${exchangeToSync}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const nonZeroBalances = res.data.balances.filter(
        (balance) => Number(balance.free) > 0 || Number(balance.locked) > 0,
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

        const foundConnected =
          res.data?.find((account) => account.exchange === exchange) ||
          res.data?.[0] ||
          null;

        setIsConnected(Boolean(foundConnected));
        setConnectedExchange(foundConnected?.exchange || null);
      } catch (error) {
        console.warn("No exchange connected yet");
        setIsConnected(false);
        setConnectedExchange(null);
      }
    };

    checkConnection();
  }, [exchange]);

  const handleConnect = async () => {
    if (!apiKey || !apiSecret) {
      toast.error("API key and secret are required");
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
      setIsConnected(true);
      setConnectedExchange(exchange);
      setApiKey("");
      setApiSecret("");
    } catch {
      toast.error("Failed to connect exchange");
    } finally {
      setLoading(false);
    }
  };

  const disconnectExchange = async () => {
    const exchangeName = connectedExchange || exchange;
    const confirmed = window.confirm(
      `Are you sure you want to disconnect ${exchangeName}?`,
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/api/exchange-accounts/${connectedExchange || exchange}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Exchange disconnected");
      setBalances([]);
      setIsConnected(false);
      setConnectedExchange(null);
    } catch (error) {
      toast.error("Failed to disconnect exchange");
      console.error(error);
    }
  };

  return (
    <div className="app-page">
      <div className="page-header">
        <div>
          <span className="page-kicker">Exchange connection</span>
          <h2 className="page-title">Connect and sync exchange balances</h2>
          <p className="page-subtitle">
            Store API credentials, sync exchange balances, and review imported assets
            without leaving the workspace.
          </p>
        </div>
      </div>

      <div className="max-w-5xl app-card p-6">
        <div className="grid gap-5">
          <Field label="Exchange">
            <select
              value={exchange}
              onChange={(event) => setExchange(event.target.value)}
              className="app-select px-4 py-3"
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
          </Field>

          <Field label="API key">
            <input
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              className="app-input px-4 py-3"
            />
          </Field>

          <Field label="API secret">
            <input
              type="password"
              placeholder="Enter your API secret"
              value={apiSecret}
              onChange={(event) => setApiSecret(event.target.value)}
              className="app-input px-4 py-3"
            />
          </Field>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleConnect}
              disabled={loading}
              className="app-button-primary flex-1 px-6 py-3 disabled:opacity-60"
            >
              {loading ? "Connecting..." : "Add exchange"}
            </button>

            <button onClick={syncBalance} className="app-button-secondary flex-1 px-6 py-3 text-sm font-semibold">
              Sync {connectedExchange || exchange} balance
            </button>
          </div>

          {isConnected && (
            <div className="rounded-[1.35rem] border border-[rgba(34,197,94,0.18)] bg-[rgba(34,197,94,0.08)] p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <img
                  src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png"
                  alt={connectedExchange || "Exchange"}
                  className="h-10 w-10"
                />
                <div className="flex-1">
                  <div className="font-semibold text-[#f7f2e8]">
                    {connectedExchange || exchange} connected
                  </div>
                  <div className="text-sm text-[#cbbca5]">
                    {connectedExchange || "Selected"} wallet linked successfully.
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="app-positive text-sm font-semibold">Active</span>
                  <button
                    onClick={disconnectExchange}
                    className="app-button-danger px-4 py-2 text-xs font-semibold"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="app-card mt-6 p-6">
        <h3 className="text-xl font-semibold text-[#f7f2e8]">Imported balances</h3>
        <div className="app-table-wrap mt-6">
          <table className="app-table">
            <thead>
              <tr>
                <th className="text-left">Asset</th>
                <th className="text-left">Quantity</th>
                <th className="text-left">Avg buy</th>
                <th className="text-left">Live price</th>
                <th className="text-left">Total value</th>
                <th className="text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {balances.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-[#9d8c73]">
                    No assets found in your connected exchange account.
                  </td>
                </tr>
              ) : (
                balances.map((balance) => {
                  const quantity = Number(balance.free) + Number(balance.locked);
                  const totalValue = 0;
                  const weight = 0;

                  return (
                    <tr key={balance.asset}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(211,155,52,0.12)] text-xs font-semibold text-[#f7f2e8]">
                            {balance.asset[0]}
                          </div>
                          <div>
                            <div className="font-medium text-[#f7f2e8]">{balance.asset}</div>
                            <div className="text-xs text-[#9d8c73]">{balance.asset}</div>
                          </div>
                        </div>
                      </td>
                      <td>{quantity.toFixed(6)}</td>
                      <td className="text-[#9d8c73]">-</td>
                      <td className="text-[#e2b768]">Rs0</td>
                      <td className="app-positive font-semibold">Rs{totalValue}</td>
                      <td className="text-right">{weight}%</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
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

export default SettingsExchanges;
