"use client";

import { AppStore, makeStore } from "@/redux/store";
import { ReactNode, useRef } from "react";

import { Provider } from "react-redux";


interface ProviderProps {
  children: ReactNode;
}
export function ReduxProvider({ children }: ProviderProps) {
    const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }
  return <Provider  store={storeRef.current}> {children}</Provider>;
}