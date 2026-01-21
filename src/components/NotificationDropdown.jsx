import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const navigate = useNavigate();

  const handleClick = (n) => {
    // Mark as read (if unread)
    if (!n.read) {
      onMarkAsRead(n.id);
    }

    // Navigate based on notification type
    if (n.type === "INFO") {
      navigate("/trades");
    } else if (n.type === "WARNING") {
      navigate("/risk-alerts");
    } else if (n.type === "SUCCESS") {
      navigate("/pnl");
    }
  };

  return (
    <div className="absolute right-0 mt-3 w-96 bg-[#0b0b24] border border-white/10 rounded-xl shadow-2xl z-50">

      {/* HEADER */}
      <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
        <h3 className="text-sm font-semibold">Notifications</h3>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>

      {/* LIST */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            No notifications yet
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className={`
              px-4 py-3 border-b border-white/5 cursor-pointer transition
              ${!n.read ? "bg-white/5 hover:bg-white/10" : "opacity-60"}
            `}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">
                {n.title}
              </span>

              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  n.type === "WARNING"
                    ? "bg-red-500/20 text-red-400"
                    : n.type === "SUCCESS"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-blue-500/20 text-blue-400"
                }`}
              >
                {n.type}
              </span>
            </div>

            <p className="text-xs text-gray-400">
              {n.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
