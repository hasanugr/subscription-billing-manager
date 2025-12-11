import type { Locale } from "./config";

export const generalMessages: Record<
  Locale,
  {
    title: string;
    meFetchLoading: string;
    meFetchUnauthorized: string;
    meFetchUnauthorizedButton: string;
    welcome: string;
    role: string;
    baseCurrency: string;
    logoutButton: string;

    // Temporally added for completeness
    categoriesButton: string;
    expensesButton: string;
    expense: string;
    income: string;
    categoriesTitle?: string;
    categoriesLoading?: string;
    categoriesError?: string;
    categoryName?: string;
    categoryAddButton?: string;
    categoryAddButtonLoading?: string;
  }
> = {
  tr: {
    title: "Abonelik ve Faturalandırma Yöneticisi",
    meFetchLoading: "Oturum kontrol ediliyor...",
    meFetchUnauthorized: "Giriş yapmadınız.",
    meFetchUnauthorizedButton: "Giriş Yap",

    welcome: "Hoş geldiniz",
    role: "Rol",
    baseCurrency: "Temel para birimi",
    logoutButton: "Çıkış Yap",

    // Temporally added for completeness
    categoriesButton: "Kategoriler",
    expensesButton: "Giderler",
    expense: "Gider",
    income: "Gelir",
    categoriesTitle: "Kategoriler",
    categoriesLoading: "Kategoriler yükleniyor...",
    categoriesError: "Kategoriler yüklenirken hata oluştu.",
    categoryName: "Kategori Adı",
    categoryAddButton: "Kategori Ekle",
    categoryAddButtonLoading: "Ekleniyor...",
  },
  en: {
    title: "Subscription & Billing Manager",
    meFetchLoading: "Checking session...",
    meFetchUnauthorized: "You are not logged in.",
    meFetchUnauthorizedButton: "Login",

    welcome: "Welcome",
    role: "Role",
    baseCurrency: "Base currency",
    logoutButton: "Logout",

    // Temporally added for completeness
    categoriesButton: "Categories",
    expensesButton: "Expenses",
    expense: "Expense",
    income: "Income",
    categoriesTitle: "Categories",
    categoriesLoading: "Loading categories...",
    categoriesError: "Error loading categories.",
    categoryName: "Category Name",
    categoryAddButton: "Add Category",
    categoryAddButtonLoading: "Adding...",
  },
};

export function getGeneralMessages(locale: Locale) {
  return generalMessages[locale];
}
