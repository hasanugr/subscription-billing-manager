"use client";

import { Layout, Typography } from "antd";
import { useThemeMode } from "@/providers/ThemeProvider";

const { Footer } = Layout;
const { Text } = Typography;

export function MainFooter() {
  const { mode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Footer
      className={`!bg-transparent border-t mt-8 ${
        isDark ? "border-white/5" : "border-slate-200"
      }`}
      suppressHydrationWarning
    >
      <div
        className={`mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] ${
          isDark ? "text-slate-400" : "text-slate-600"
        }`}
      >
        <Text>
          © {new Date().getFullYear()} Subscription &amp; Billing Manager. Tüm
          hakları saklıdır.
        </Text>
        <Text>
          Kişisel bir proje – abonelik, gelir ve gider senaryolarını gerçek
          hayata yakın modellemek için geliştirildi.
        </Text>
      </div>
    </Footer>
  );
}
