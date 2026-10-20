import { baseApi } from "../../api/baseApi";
import {
  ApiResponse,
  AuthSuccessData,
  TLoginValues,
  TRegisterValues,
  UserProfile,
} from "@/types";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<AuthSuccessData>, TLoginValues>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<ApiResponse<AuthSuccessData>, TRegisterValues>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    profile: builder.query<ApiResponse<UserProfile>, void>({
      query: () => ({
        url: "/auth/profile",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useProfileQuery } =
  authApi;
