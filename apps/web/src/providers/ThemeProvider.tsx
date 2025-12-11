"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

type ThemeMode = "light" | "dark";

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "sbm-theme";

const { defaultAlgorithm, darkAlgorithm } = antdTheme;

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Script'te zaten dark class eklendi, onu oku
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") {
      // SSR'da default dark
      return "dark";
    }

    // Client'ta HTML'deki dark class'ına bak
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(STORAGE_KEY, mode);

    const root = window.document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
      // Dark mode CSS variables
      root.style.setProperty("--card-bg", "rgba(30, 41, 59, 0.6)");
      root.style.setProperty("--card-border", "rgba(148, 163, 184, 0.15)");
      root.style.setProperty("--text-primary", "#f1f5f9");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--text-tertiary", "#94a3b8");
      root.style.setProperty("--border-color", "rgba(148, 163, 184, 0.15)");
    } else {
      root.classList.remove("dark");
      // Light mode CSS variables
      root.style.setProperty("--card-bg", "#ffffff");
      root.style.setProperty("--card-border", "#e2e8f0");
      root.style.setProperty("--text-primary", "#0f172a");
      root.style.setProperty("--text-secondary", "#475569");
      root.style.setProperty("--text-tertiary", "#64748b");
      root.style.setProperty("--border-color", "#cbd5e1");
    }
  }, [mode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
  };

  const isDark = mode === "dark";

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ConfigProvider
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: isDark
            ? {
                // DARK PALETTE - Modern & Vibrant
                colorPrimary: "#10b981", // Emerald-500 - canlı yeşil
                colorSuccess: "#34d399", // Emerald-400
                colorWarning: "#fbbf24", // Amber-400
                colorError: "#f87171", // Red-400
                colorInfo: "#60a5fa", // Blue-400
                colorBgBase: "#0f172a", // Slate-900
                colorBgLayout: "#0f172a",
                colorBgContainer: "rgba(30, 41, 59, 0.5)", // Slate-800 with transparency
                colorBgElevated: "#1e293b", // Slate-800
                colorBorder: "rgba(148, 163, 184, 0.1)", // Slate-400 subtle
                colorBorderSecondary: "rgba(148, 163, 184, 0.05)",
                colorText: "#f1f5f9", // Slate-100
                colorTextSecondary: "#cbd5e1", // Slate-300
                colorTextTertiary: "#94a3b8", // Slate-400
                colorTextHeading: "#ffffff",
                borderRadius: 12,
                colorLink: "#34d399", // Emerald-400
                colorLinkHover: "#6ee7b7", // Emerald-300
              }
            : {
                // LIGHT PALETTE - Fresh & Modern (Better Readability)
                colorPrimary: "#059669", // Emerald-600 - derin yeşil
                colorSuccess: "#10b981", // Emerald-500
                colorWarning: "#f59e0b", // Amber-500
                colorError: "#ef4444", // Red-500
                colorInfo: "#3b82f6", // Blue-500
                colorBgBase: "#ffffff",
                colorBgLayout: "#f8fafc", // Slate-50
                colorBgContainer: "#ffffff",
                colorBgElevated: "#ffffff",
                colorBorder: "#cbd5e1", // Slate-300 - daha belirgin
                colorBorderSecondary: "#e2e8f0", // Slate-200
                colorText: "#0f172a", // Slate-900 - ana metin
                colorTextSecondary: "#475569", // Slate-600 - ikincil (daha koyu)
                colorTextTertiary: "#64748b", // Slate-500 - üçüncül (daha koyu)
                colorTextHeading: "#020617", // Slate-950
                colorTextLabel: "#1e293b", // Slate-800 - label'lar için
                colorTextDescription: "#64748b", // Slate-500 - açıklamalar için
                borderRadius: 12,
                colorLink: "#059669", // Emerald-600
                colorLinkHover: "#047857", // Emerald-700
                colorSplit: "#cbd5e1", // Divider rengi - daha belirgin
                fontSize: 14,
              },
        }}
      >
        <div
          className={
            isDark
              ? "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 text-slate-100"
              : "min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/50 text-slate-900"
          }
          suppressHydrationWarning
        >
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}
