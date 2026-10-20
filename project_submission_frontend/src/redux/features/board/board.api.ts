import { baseApi } from "../../api/baseApi";

const boardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewBoard: builder.mutation({
      query: (payload) => ({
        url: "/board/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),
    userAllBoards: builder.query({
      query: () => ({
        url: "/board/user-wise",
        method: "GET",
      }),
      providesTags: ["boards"],
    }),
    boardDetails: builder.query({
      query: (id) => ({
        url: `/board/details/${id}`,
        method: "GET",
      }),
      providesTags: ["boards"],
    }),
    updateBoard: builder.mutation({
      query: (payload) => ({
        url: "/board/update",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),
    deleteBoard: builder.mutation({
      query: (id) => ({
        url: `/board/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boards"],
    }),
    uninvitedMembers: builder.query({
      query: (id) => ({
        url: `/board/uninvited-members/${id}`,
        method: "GET",
      }),
      providesTags: ["boards"],
    }),

    inviteMember: builder.mutation({
      query: (payload) => ({
        url: "/board/invite-member",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    removeMember: builder.mutation({
      query: (id) => ({
        url: `/board/remove-member/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boards"],
    }),

    updateMemberRole: builder.mutation({
      query: (id) => ({
        url: `/board/update-member-role/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["boards"],
    }),
  }),
});

export const {
  useCreateNewBoardMutation,
  useUserAllBoardsQuery,
  useUpdateBoardMutation,
  useBoardDetailsQuery,
  useDeleteBoardMutation,
  useUninvitedMembersQuery,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} = boardApi;
