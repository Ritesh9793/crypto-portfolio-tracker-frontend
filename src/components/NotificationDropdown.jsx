import { useNavigate } from "react-router-dom";

export default function NotificationDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const navigate = useNavigate();

  const handleClick = (notification) => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }

    if (notification.type === "INFO") navigate("/trades");
    else if (notification.type === "WARNING") navigate("/risk-alerts");
    else if (notification.type === "SUCCESS") navigate("/pnl-reports");
  };

  return (
    <div className="custom-scrollbar fixed right-6 top-16 z-[9999] w-[380px] overflow-hidden rounded-[1.4rem] border border-[rgba(226,183,104,0.14)] bg-[rgba(24,17,11,0.98)] shadow-[0_24px_60px_rgba(0,0,0,0.34)]">
      <div className="flex items-center justify-between border-b border-[rgba(226,183,104,0.08)] px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.08em] text-[#f7f2e8]">
            Notifications
          </h3>
          <p className="mt-1 text-xs text-[#9d8c73]">
            Alerts across trades, risk, and reports.
          </p>
        </div>

        <button
          onClick={onMarkAllAsRead}
          className="text-xs font-semibold text-[#d39b34] transition hover:text-[#f7f2e8]"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {notifications.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-[#9d8c73]">
            You are all caught up.
          </div>
        )}

        {notifications.map((notification) => (
          <button
            key={notification.id}
            onClick={() => handleClick(notification)}
            className={`w-full border-b border-[rgba(226,183,104,0.06)] px-5 py-4 text-left transition ${
              notification.read
                ? "opacity-70 hover:bg-[rgba(255,248,236,0.03)]"
                : "bg-[rgba(255,248,236,0.03)] hover:bg-[rgba(255,248,236,0.06)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#f7f2e8]">
                  {notification.title}
                </p>
                <p className="mt-2 text-xs leading-6 text-[#cbbca5]">
                  {notification.message}
                </p>
              </div>

              <span
                className={`app-pill ${
                  notification.type === "WARNING"
                    ? "bg-[rgba(239,68,68,0.12)] text-[#fca5a5]"
                    : notification.type === "SUCCESS"
                      ? "bg-[rgba(34,197,94,0.12)] text-[#86efac]"
                      : "bg-[rgba(211,155,52,0.12)] text-[#e2b768]"
                }`}
              >
                {notification.type}
              </span>
            </div>

            {!notification.read && (
              <span className="mt-3 inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d39b34]">
                Unread
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
