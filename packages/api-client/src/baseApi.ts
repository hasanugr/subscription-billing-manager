import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiResponse } from "./types";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (typeof process !== "undefined" &&
        process.env.NEXT_PUBLIC_API_BASE_URL) ||
      "http://localhost:4000/api",
    credentials: "include", // Important to include cookies for auth
  }),
  tagTypes: ["Auth", "Category", "Expense", "Income"],
  endpoints: () => ({}),
});

// Helper to handle backend's { data, error } wrapping
export function unwrapData<T>(response: ApiResponse<T>): T {
  return response.data as T;
}
