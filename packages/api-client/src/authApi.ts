import { baseApi, unwrapData } from "./baseApi";
import type { User, ApiResponse } from "./types";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
}

type MeResponse = User | null;

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query<User | null, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<MeResponse>) =>
        unwrapData<MeResponse>(response),
      providesTags: ["Auth"],
    }),

    login: builder.mutation<User, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<User>) =>
        unwrapData<User>(response),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<User>) =>
        unwrapData<User>(response),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "Category", "Expense", "Income"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
