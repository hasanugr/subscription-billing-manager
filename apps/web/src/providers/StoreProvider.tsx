"use client";

import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { webStore } from "@/store/store";

export function StoreProvider({ children }: { children: ReactNode }) {
  return <Provider store={webStore}>{children}</Provider>;
}
