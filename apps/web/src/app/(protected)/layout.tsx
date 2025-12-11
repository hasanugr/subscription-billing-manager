import type { ReactNode } from "react";
import { ProtectedShell } from "@/components/layout/ProtectedShell";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return <ProtectedShell>{children}</ProtectedShell>;
}
