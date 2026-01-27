import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const bellRef = useRef(null);

  /* ---------------- FETCH NOTIFICATIONS ---------------- */
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
    } catch (err) {
      console.error(
        "Notification fetch failed:",
        err.response?.status,
        err.response?.data
      );
    }
  };

  /* ---------------- FETCH UNREAD COUNT ---------------- */
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
    } catch (err) {
      console.error("Unread count fetch failed", err);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, []);

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------------- MARK SINGLE AS READ ---------------- */
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
        }
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Mark as read failed", err);
    }
  };

  /* ---------------- MARK ALL AS READ ---------------- */
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
        }
      );

      fetchNotifications();
      fetchUnreadCount();
    } catch (err) {
      console.error("Mark all as read failed", err);
    }
  };

  return (
    <div className="relative" ref={bellRef}>
      {/* BELL ICON */}
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
        className="relative p-2 rounded-full hover:bg-white/10 transition"
      >
        🔔

        {/* UNREAD DOT */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
        )}
      </button>

      {/* DROPDOWN */}
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
