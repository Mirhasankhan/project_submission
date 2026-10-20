import { JWTDecode } from "@/utils/jwt";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL, 
   
    prepareHeaders: (headers) => {
      const { token } = JWTDecode();

      headers.set("Authorization", `Bearer ${token as string}`);

      // if (token) {
      //   headers.set("Authorization", `${token}`);
      // }
      return headers;
    },
  }),
  tagTypes: [
    "users",   
    "boards",
  ],
  endpoints: () => ({}),
});
