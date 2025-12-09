import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string } | null;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api",
    credentials: "include",
  }),
  tagTypes: ["Auth", "User"],
  endpoints: () => ({}),
});
