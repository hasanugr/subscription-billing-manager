import { baseApi, unwrapData } from "./baseApi";
import type { Income, RecurrencePeriod, ApiResponse } from "./types";

interface CreateIncomeRequest {
  categoryId: string;
  amount: number;
  currency: string;
  date: string;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: string | null;
  recurrenceEnd?: string | null;
  note?: string | null;
}

interface UpdateIncomeRequest {
  id: string;
  categoryId?: string;
  amount?: number;
  currency?: string;
  date?: string;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: string | null;
  recurrenceEnd?: string | null;
  note?: string | null;
}

export const incomeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getIncomes: builder.query<Income[], void>({
      query: () => ({
        url: "/incomes",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<Income[]>) =>
        unwrapData<Income[]>(response),
      providesTags: (result) =>
        result
          ? [
              ...result.map((i) => ({
                type: "Income" as const,
                id: i.id,
              })),
              { type: "Income" as const, id: "LIST" },
            ]
          : [{ type: "Income" as const, id: "LIST" }],
    }),

    createIncome: builder.mutation<Income, CreateIncomeRequest>({
      query: (body) => ({
        url: "/incomes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Income>) =>
        unwrapData<Income>(response),
      invalidatesTags: [{ type: "Income", id: "LIST" }],
    }),

    updateIncome: builder.mutation<Income, UpdateIncomeRequest>({
      query: ({ id, ...body }) => ({
        url: `/incomes/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<Income>) =>
        unwrapData<Income>(response),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Income", id: arg.id },
        { type: "Income", id: "LIST" },
      ],
    }),

    deleteIncome: builder.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `/incomes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Income", id: arg.id },
        { type: "Income", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetIncomesQuery,
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
} = incomeApi;
