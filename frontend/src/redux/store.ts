"use client";
import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "./api/apiSlice";
import authSlice, { loadUser } from "./queries/auth/authSlice";


export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [apiSlice.reducerPath]: apiSlice.reducer,
      auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
  });

  

  store.dispatch(loadUser());
  
  return store;
  
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']  


