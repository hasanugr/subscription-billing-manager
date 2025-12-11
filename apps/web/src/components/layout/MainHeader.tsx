"use client";

import { Layout, Button, Segmented, Space } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { useThemeMode } from "@/providers/ThemeProvider";
import { useMeQuery } from "@sbm/api-client";

const { Header } = Layout;

export function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const { mode, setMode } = useThemeMode();
  const { data: me } = useMeQuery();

  const isDark = mode === "dark";
  const isProtected = pathname?.startsWith("/dashboard");

  const handleLogoClick = () => {
    if (me) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <Header
      className={`!bg-transparent border-b backdrop-blur ${
        isDark ? "border-white/5" : "border-slate-200"
      }`}
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
        <button
          type="button"
          onClick={handleLogoClick}
          className="flex items-center gap-2"
        >
          <div className="h-9 w-9 rounded-2xl bg-emerald-400/20 flex items-center justify-center">
            <span className="text-emerald-400 text-lg font-semibold">₺</span>
          </div>
          <span className="font-semibold tracking-tight">
            Subscription &amp; Billing Manager
          </span>
        </button>

        <div className="flex items-center gap-4">
          {/* Theme switcher */}
          <Segmented
            size="small"
            value={mode}
            onChange={(val) => setMode(val as "light" | "dark")}
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
            className={`text-[11px] ${isDark ? "bg-white/10" : "bg-slate-100"}`}
          />

          {me && (
            <Space size="small" className="hidden md:flex">
              <Button
                type={isProtected ? "primary" : "text"}
                size="small"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => router.push("/dashboard/expenses")}
              >
                Giderler
              </Button>
              <Button
                type="text"
                size="small"
                onClick={() => router.push("/dashboard/incomes")}
              >
                Gelirler
              </Button>
            </Space>
          )}

          {me ? (
            <Button
              size="small"
              shape="round"
              onClick={() => router.push("/dashboard")}
            >
              {me.email ?? "Hesabım"}
            </Button>
          ) : (
            <>
              <Button
                type="text"
                size="small"
                onClick={() => router.push("/auth/login")}
                className={isDark ? "text-slate-200 hover:!text-white" : ""}
              >
                Nasıl çalışır?
              </Button>
              <Button
                type="primary"
                size="small"
                shape="round"
                onClick={() => router.push("/auth/login")}
              >
                Hesabına giriş yap
              </Button>
            </>
          )}
        </div>
      </div>
    </Header>
  );
}
