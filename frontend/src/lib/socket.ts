"use client"
import { io, Socket } from "socket.io-client";
// import { BASE_URL } from "@/lib/constants";
let token = localStorage.getItem('token');
let socket: Socket | null = null;


export const connectSocket = (): Socket => {
  
  if (!socket) {
    socket = io('http://97.74.89.204:5000', { auth: { token } });
     

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket?.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
    });

    socket.on("disconnect", (reason) => {
      console.warn("Disconnected from WebSocket server. Reason:", reason);
    });

    // Explicit connection
    socket.connect();
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    console.warn("Socket not initialized. Connecting now...");
    return connectSocket();
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected.");
  }
};
