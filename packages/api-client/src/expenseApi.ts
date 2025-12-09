import { baseApi, unwrapData } from "./baseApi";
import type { Expense, RecurrencePeriod, ApiResponse } from "./types";

interface CreateExpenseRequest {
  categoryId: string;
  amount: number;
  currency: string;
  date: string; // ISO
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: string | null;
  recurrenceEnd?: string | null;
  isSubscription?: boolean;
  note?: string | null;
}

interface UpdateExpenseRequest {
  id: string;
  categoryId?: string;
  amount?: number;
  currency?: string;
  date?: string;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: string | null;
  recurrenceEnd?: string | null;
  isSubscription?: boolean;
  note?: string | null;
}

export const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getExpenses: builder.query<Expense[], void>({
      query: () => ({
        url: "/expenses",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Expense[]>) =>
        unwrapData<Expense[]>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((e) => ({
                type: "Expense" as const,
                id: e.id,
              })),
              { type: "Expense" as const, id: "LIST" },
            ]
          : [{ type: "Expense" as const, id: "LIST" }],
    }),

    createExpense: builder.mutation<Expense, CreateExpenseRequest>({
      query: (body) => ({
        url: "/expenses",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Expense>) =>
        unwrapData<Expense>(response),
      invalidatesTags: [{ type: "Expense", id: "LIST" }],
    }),

    updateExpense: builder.mutation<Expense, UpdateExpenseRequest>({
      query: ({ id, ...body }) => ({
        url: `/expenses/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<Expense>) =>
        unwrapData<Expense>(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Expense", id: arg.id },
        { type: "Expense", id: "LIST" },
      ],
    }),

    deleteExpense: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/expenses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Expense", id: arg.id },
        { type: "Expense", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
