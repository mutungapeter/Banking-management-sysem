
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_SERVER_URI,
    prepareHeaders: async(headers) => {
        const accessToken = Cookies.get("accessToken");
        // console.log("accessToken", accessToken)
        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: () => ({}),
});

export const {} = apiSlice;
