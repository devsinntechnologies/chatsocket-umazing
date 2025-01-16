"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the types
interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface MessagesState {
  messages: Message[];
  filter: string;
}

// Initial state
const initialState: MessagesState = {
  messages: [], // Array to store messages
  filter: "All", // Default filter value
};

// Create the messages slice
export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    // Set all messages
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    // Add a new message
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload]; // Ensure immutability
    },
    // Update the filter value
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

// Export actions
export const { setMessages, addMessage, setFilter } = messagesSlice.actions;

// Export selectors
export const selectMessages = (state: { messages: MessagesState }) => state.messages.messages;
export const selectFilter = (state: { messages: MessagesState }) => state.messages.filter;

// Export reducer
export default messagesSlice.reducer;
