import type { ReactNode } from "react";
import "antd/dist/reset.css";
import "./globals.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProvider } from "@/providers/StoreProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-script" strategy="beforeInteractive">
          {`
            (function() {
              try {
                const theme = localStorage.getItem('sbm-theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            })();
          `}
        </Script>
      </head>
      <body suppressHydrationWarning>
        <AntdRegistry>
          <ThemeProvider>
            <StoreProvider>{children}</StoreProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
