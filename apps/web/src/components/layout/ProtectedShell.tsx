"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Layout, Spin } from "antd";
import { useMeQuery } from "@sbm/api-client";
import { MainHeader } from "./MainHeader";
import { MainFooter } from "./MainFooter";

const { Content } = Layout;

export function ProtectedShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: me, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (!isLoading && (!me || isError)) {
      router.replace("/");
    }
  }, [isLoading, me, isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <Layout className="flex flex-col !min-h-screen bg-transparent">
      <MainHeader />

      <Content className="flex-1 mx-auto max-w-6xl w-full px-4 py-6">
        {children}
      </Content>

      <MainFooter />
    </Layout>
  );
}
