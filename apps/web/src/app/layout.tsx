import type { ReactNode } from "react";
import "./globals.css";
import { StoreProvider } from "@/providers/StoreProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
