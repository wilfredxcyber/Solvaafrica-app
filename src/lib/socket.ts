import { io } from "socket.io-client";
import { API_BASE_URL } from "../api/apiClient";

export const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
