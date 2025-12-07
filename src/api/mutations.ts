import { AUTH_API_CLIENT } from "./apiClient";

export const fetchUnreadCount = async (): Promise<number> => {
  const response = await AUTH_API_CLIENT.get("/notification/all");
  const notifications = response.data.data;
  // Return the count so consumers can rely on a number instead of the raw array
  return notifications.filter((n: any) => n.isRead === false).length;
};


