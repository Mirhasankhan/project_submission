import { baseApi } from "../../api/baseApi";
import {
  ApiResponse,
  ApproveRejectPayload,
  CreateSubmissionPayload,
  SubmissionQueryParams,
  SubmissionResponseData,
} from "@/types";

export const submissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitProject: builder.mutation<
      ApiResponse<null>,
      CreateSubmissionPayload
    >({
      query: (body) => ({
        url: "/submission",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Submissions"],
    }),

    getMySubmissions: builder.query<
      ApiResponse<SubmissionResponseData>,
      SubmissionQueryParams | void
    >({
      query: (params) => ({
        url: "/submission/mine",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Submissions"],
    }),

    getAllSubmissions: builder.query<
      ApiResponse<SubmissionResponseData>,
      SubmissionQueryParams | void
    >({
      query: (params) => ({
        url: "/submission/all",
        method: "GET",
        params: params || {},
      }),
      providesTags: ["Submissions"],
    }),

    approveRejectSubmission: builder.mutation<
      ApiResponse<null>,
      ApproveRejectPayload
    >({
      query: (body) => ({
        url: "/submission/update-status",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Submissions"],
    }),
  }),
});

export const {
  useSubmitProjectMutation,
  useGetMySubmissionsQuery,
  useGetAllSubmissionsQuery,
  useApproveRejectSubmissionMutation,
} = submissionApi;
