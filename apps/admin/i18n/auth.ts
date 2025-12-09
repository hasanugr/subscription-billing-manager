import type { Locale } from "./config";

export const authMessages: Record<
  Locale,
  {
    loginTitle: string;
    loginEmailLabel: string;
    loginPasswordLabel: string;
    loginButton: string;
    loginNoAccount: string;
    loginNoAccountLink: string;

    registerTitle: string;
    registerEmailLabel: string;
    registerPasswordLabel: string;
    registerButton: string;
    registerHaveAccount: string;
    registerHaveAccountLink: string;

    genericError: string;
  }
> = {
  tr: {
    loginTitle: "Giriş Yap",
    loginEmailLabel: "E-posta",
    loginPasswordLabel: "Şifre",
    loginButton: "Giriş",
    loginNoAccount: "Hesabın yok mu?",
    loginNoAccountLink: "Kayıt ol",

    registerTitle: "Kayıt Ol",
    registerEmailLabel: "E-posta",
    registerPasswordLabel: "Şifre",
    registerButton: "Kayıt ol",
    registerHaveAccount: "Zaten bir hesabın var mı?",
    registerHaveAccountLink: "Giriş yap",

    genericError: "İşlem sırasında bir hata oluştu.",
  },
  en: {
    loginTitle: "Login",
    loginEmailLabel: "Email",
    loginPasswordLabel: "Password",
    loginButton: "Login",
    loginNoAccount: "Don’t have an account?",
    loginNoAccountLink: "Register",

    registerTitle: "Register",
    registerEmailLabel: "Email",
    registerPasswordLabel: "Password",
    registerButton: "Register",
    registerHaveAccount: "Already have an account?",
    registerHaveAccountLink: "Login",

    genericError: "Something went wrong.",
  },
};

export function getAuthMessages(locale: Locale) {
  return authMessages[locale];
}
