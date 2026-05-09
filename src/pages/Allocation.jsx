import React, { useMemo } from "react";

/*
  Props expected:
  holdings = [
    {
      asset: "Bitcoin",
      symbol: "BTC",
      quantity: 0.01,
      price: 46500
    },
    ...
  ]
*/

export default function Allocation({ holdings = [] }) {
  // 🔹 Calculate allocation data
  const allocationData = useMemo(() => {
    if (!Array.isArray(holdings) || holdings.length === 0) return [];

    const values = holdings.map(h => ({
      ...h,
      value: h.quantity * h.price
    }));

    const totalValue = values.reduce((sum, a) => sum + a.value, 0);

    return values.map(a => ({
      ...a,
      allocation: totalValue > 0 ? (a.value / totalValue) * 100 : 0
    }));
  }, [holdings]);

  const formatINR = value =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(value);

  const colors = [
    "bg-orange-500", // BTC
    "bg-blue-500",   // ETH
    "bg-purple-500", // SOL
    "bg-green-500",  // ADA
    "bg-pink-500"
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-6">
        Portfolio Allocation
      </h2>

      {allocationData.length === 0 ? (
        <p className="text-gray-400">No holdings to display</p>
      ) : (
        <div className="space-y-6">
          {allocationData.map((asset, index) => (
            <div key={asset.symbol}>
              {/* Asset Header */}
              <div className="flex justify-between items-center mb-1">
                <div className="text-white font-medium">
                  {asset.asset} ({asset.symbol})
                </div>
                <div className="text-sm text-gray-300">
                  {asset.allocation.toFixed(2)}%
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${colors[index % colors.length]}`}
                  style={{ width: `${asset.allocation}%` }}
                />
              </div>

              {/* Value */}
              <div className="text-xs text-gray-400 mt-1">
                Value: {formatINR(asset.value)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
