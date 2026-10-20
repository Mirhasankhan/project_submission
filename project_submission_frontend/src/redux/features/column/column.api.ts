import { baseApi } from "../../api/baseApi";

const columnApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewColumn: builder.mutation({
      query: (payload: { boardId: string; title: string }) => ({
        url: "/column/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    updateColumnTitle: builder.mutation({
      query: (payload: { columnId: string; title: string }) => ({
        url: "/column/update",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    reorderColumn: builder.mutation({
      query: (payload: { columnId: string; targetIndex: number }) => ({
        url: "/column/reorder",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    deleteColumn: builder.mutation({
      query: (columnId: string) => ({
        url: `/column/delete/${columnId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boards"],
    }),
  }),
});

export const {
  useAddNewColumnMutation,
  useUpdateColumnTitleMutation,
  useUpdateColumnTitleMutation: useUpdateColumnMutation,
  useReorderColumnMutation,
  useReorderColumnMutation: useMoveColumnMutation,
  useDeleteColumnMutation,
} = columnApi;
