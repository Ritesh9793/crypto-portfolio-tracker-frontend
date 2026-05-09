import api from "./axios";

export const getNotifications = () =>
  api.get("/api/notifications");

export const getUnreadCount = () =>
  api.get("/api/notifications/unread-count");

export const markAsRead = (id) =>
  api.post(`/api/notifications/${id}/read`);