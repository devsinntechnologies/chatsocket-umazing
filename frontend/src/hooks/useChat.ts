"use client"
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { connectSocket, getSocket } from "@/lib/socket";
import { BASE_URL } from "@/lib/constants";

export const chat = createApi({
  reducerPath: "chat",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/chat/`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem("token");
      console.log(token)
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchChats: builder.query({
      query: (userId: string) => `/chat_rooms/`,
    }),

    sendMessage: builder.mutation({
      queryFn: async (messageData, _queryApi, _extraOptions, fetchWithBQ) => {
        try {
          const socket = getSocket();

          return new Promise((resolve) => {
            socket.emit("sendMessage", messageData, (response: any) => {
              if (response?.success) {
                resolve({ data: { success: true, message: response.message } });
              } else {
                resolve({
                  error: {
                    status: 500,
                    data: { message: response?.message || "Failed to send message." },
                  },
                });
              }
            });
          });
        } catch (error) {
          return {
            error: {
              status: 500,
              data: { message: "WebSocket error while sending the message." },
            },
          };
        }
      },
    }),
  }),
});

export const { useFetchChatsQuery, useSendMessageMutation } = chat;
