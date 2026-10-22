import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { RootState } from "../store";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const stateToken = (getState() as RootState)?.auth?.token;
      const cookieToken =
        typeof window !== "undefined"
          ? Cookies.get("token") || Cookies.get("accessToken")
          : null;

      const token = stateToken || cookieToken;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Auth", "Submissions"],
  endpoints: () => ({}),
});
