import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../api/axios";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);
    } catch (error) {
      console.error(
        "Notification fetch failed:",
        error.response?.status,
        error.response?.data,
      );
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/api/notifications/unread-count", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUnreadCount(res.data);
    } catch (error) {
      console.error("Unread count fetch failed", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  useEffect(() => {
    const handler = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post(
        `/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Mark as read failed", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await api.post(
        "/api/notifications/read-all",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error("Mark all as read failed", error);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={() => {
          setOpen((current) => !current);
          if (!open) fetchNotifications();
        }}
        className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(226,183,104,0.12)] bg-[rgba(255,248,236,0.03)] text-[#f7f2e8] transition hover:border-[rgba(226,183,104,0.24)] hover:bg-[rgba(255,248,236,0.06)]"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d39b34] px-1 text-[10px] font-bold text-[#120d08]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />
      )}
    </div>
  );
}
