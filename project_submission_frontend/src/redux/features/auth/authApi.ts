import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerRequest: builder.mutation({
      query: (userInfo) => ({
        url: "/user/create-pending",
        method: "POST",
        body: userInfo,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/user/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (email) => ({
        url: "/user/resend-otp",
        method: "POST",
        body: email,
      }),
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
      invalidatesTags: ["users"],
    }),
    googleLogin: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/google-login",
        method: "POST",
        body: userInfo,
      }),
    }),
    profile: builder.query({
      query: () => ({
        url: "/user/my-profile",
        method: "GET",
      }),
      providesTags: ["users"],
    }),
    sendOtp: builder.mutation({
      query: (email) => ({
        url: "/auth/send-otp",
        method: "POST",
        body: email,
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: { email, otp },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "PATCH",
        body: data,
        headers: {
          Authorization: data.token,
        },
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/profile-update",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useSendOtpMutation,
  useRegisterRequestMutation,
  useVerifyEmailMutation,
  useResendOtpMutation,
  useProfileQuery,
  useLoginMutation,
  useUpdateProfileMutation,
  useGoogleLoginMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
