import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

export const connectSocket = async () => {
  const userStr = await AsyncStorage.getItem("User");
  if (!userStr) throw new Error("User not found in storage");

  const user = JSON.parse(userStr);
  const accessToken = user?.tokens?.accessToken;
  if (!accessToken) throw new Error("No accessToken found");

  const isDev = process.env.NODE_ENV !== "production";
  const SOCKET_URL = isDev
    ? "wss://solva-backend-prod.onrender.com"
    : "wss://api.solvaafrica.com/api/v1";

  const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
    extraHeaders: {
      token: accessToken,
    },
  });

  return socket;
};
