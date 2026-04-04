import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import DashboardLayout from "../layout/DashboardLayout";

const riskPalette = {
  HIGH: "bg-red-500/10 text-red-400 border-red-500/20",
  MEDIUM: "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
  LOW: "bg-green-500/10 text-green-400 border-green-500/20",
};

export default function RiskAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState("ALL");

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/risk-alerts");
        setAlerts(res.data || []);
      } catch (err) {
        console.error("Risk alert fetch error:", err);
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  const filteredAlerts = useMemo(() => {
    if (selectedRisk === "ALL") {
      return alerts;
    }
    return alerts.filter((alert) => alert.riskLevel === selectedRisk);
  }, [alerts, selectedRisk]);

  const riskCounts = useMemo(
    () => ({
      HIGH: alerts.filter((alert) => alert.riskLevel === "HIGH").length,
      MEDIUM: alerts.filter((alert) => alert.riskLevel === "MEDIUM").length,
      LOW: alerts.filter((alert) => alert.riskLevel === "LOW").length,
    }),
    [alerts]
  );

  return (
    <DashboardLayout>
      <div className="p-10 text-white min-h-screen cyberpunk-bg">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-wide">Risk Alerts</h1>
          <p className="text-gray-400 mt-2">
            Backend-generated volatility and market-cap alerts aligned to the assignment risk module.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {["ALL", "HIGH", "MEDIUM", "LOW"].map((riskLevel) => (
            <button
              key={riskLevel}
              onClick={() => setSelectedRisk(riskLevel)}
              className={`rounded-2xl border px-5 py-4 text-left ${
                riskLevel === "ALL"
                  ? "border-white/10 bg-white/5"
                  : riskPalette[riskLevel]
              } ${selectedRisk === riskLevel ? "ring-2 ring-pink-400/70" : ""}`}
            >
              <div className="text-sm text-gray-400">{riskLevel === "ALL" ? "All alerts" : `${riskLevel} risk`}</div>
              <div className="text-2xl font-semibold mt-2">
                {riskLevel === "ALL"
                  ? alerts.length
                  : riskCounts[riskLevel]}
              </div>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-gray-400">Loading risk alerts...</p>
        ) : filteredAlerts.length === 0 ? (
          <p className="text-gray-400">No alerts found for the selected risk level.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredAlerts.map((alert, index) => (
              <div
                key={`${alert.symbol}-${index}`}
                className="rounded-2xl border border-white/10 bg-black/30 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">
                      {alert.asset} ({alert.symbol?.toUpperCase()})
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{alert.reason}</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${riskPalette[alert.riskLevel]}`}>
                    {alert.riskLevel}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm text-gray-300">
                  <div>
                    <span className="text-gray-500">Alert type:</span> {alert.alertType || "contract_risk"}
                  </div>
                  <div>
                    <span className="text-gray-500">Source:</span> {alert.source || "Internal analysis"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
