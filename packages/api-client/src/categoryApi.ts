import { baseApi, unwrapData } from "./baseApi";
import type { Category, CategoryType, ApiResponse } from "./types";

interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  isGlobal?: boolean;
}

interface UpdateCategoryRequest {
  id: string;
  name?: string;
  type?: CategoryType;
}

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Category[]>) =>
        unwrapData<Category[]>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((c) => ({
                type: "Category" as const,
                id: c.id,
              })),
              { type: "Category" as const, id: "LIST" },
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        unwrapData<Category>(response),
      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    updateCategory: builder.mutation<Category, UpdateCategoryRequest>({
      query: ({ id, ...body }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<Category>) =>
        unwrapData<Category>(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Category", id: arg.id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
