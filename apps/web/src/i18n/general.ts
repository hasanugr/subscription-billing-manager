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
  },
};

export function getGeneralMessages(locale: Locale) {
  return generalMessages[locale];
}
