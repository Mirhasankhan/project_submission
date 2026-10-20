import { baseApi } from "../../api/baseApi";

const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewTask: builder.mutation({
      query: (payload: { columnId: string; title: string }) => ({
        url: "/task/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    updateTask: builder.mutation({
      query: (payload: { taskId: string; title: string }) => ({
        url: "/task/update",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    moveTask: builder.mutation({
      query: (payload: {
        taskId: string;
        targetColumnId: string;
        targetIndex: number;
      }) => ({
        url: "/task/move",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["boards"],
    }),

    deleteTask: builder.mutation({
      query: (taskId: string) => ({
        url: `/task/delete/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["boards"],
    }),
  }),
});

export const {
  useAddNewTaskMutation,
  useUpdateTaskMutation,
  useMoveTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
