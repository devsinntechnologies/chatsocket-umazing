import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query/react';
import { chat } from '@/hooks/useChat';
import messagesReducer from '@/slice/messagesSlice' 
import { auth } from '@/hooks/UseAuth';
import { authSlice } from '@/slice/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      messages: messagesReducer,
      [chat.reducerPath]: chat.reducer,
      [auth.reducerPath]: auth.reducer,
      authSlice: authSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        auth.middleware,
        chat.middleware,
      ),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// Automatically set up listeners to enable caching and refetching
setupListeners(makeStore().dispatch);

export default makeStore;
