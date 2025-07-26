import { AUTH_API_CLIENT } from "./apiClient";

 export const fetchUnreadCount = async () => {
  const response = await AUTH_API_CLIENT.get("/notification/all");
  const notifications = response.data.data;
  return notifications.filter((n: any) => !n.isRead).length;
};


