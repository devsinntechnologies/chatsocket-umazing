'use client';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from '../store/store';
import { Store } from 'redux'; // Import the Store type from redux

interface StoreProviderProps {
  children: ReactNode; // Define the type for children
}

export default function StoreProvider({ children }: StoreProviderProps) {
  const storeRef = useRef<Store | undefined>(undefined); // Use a ref type

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
