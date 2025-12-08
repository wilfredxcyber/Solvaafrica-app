import { AUTH_API_CLIENT } from "./apiClient";

// src/api/mutations.ts
export const fetchUnreadCount = async (): Promise<number> => {
  const response = await AUTH_API_CLIENT.get("/notification/all");
  const notifications = response.data.data;
  return notifications.filter((n: any) => !n.isRead).length; // handles "false"/false
};


