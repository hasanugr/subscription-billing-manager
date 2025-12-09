export type Role = "USER" | "ADMIN";

export type CategoryType = "INCOME" | "EXPENSE";

export type RecurrencePeriod = "NONE" | "WEEKLY" | "MONTHLY" | "YEARLY";

export interface User {
  id: string;
  email: string;
  role: Role;
  baseCurrency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isGlobal: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  currency: string;
  date: string;

  recurrencePeriod: RecurrencePeriod;
  recurrenceStart: string | null;
  recurrenceEnd: string | null;

  isSubscription: boolean;
  note: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  currency: string;
  date: string;

  recurrencePeriod: RecurrencePeriod;
  recurrenceStart: string | null;
  recurrenceEnd: string | null;

  note: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
