"use client";

import type { ReactNode } from "react";
import { Layout } from "antd";
import { MainHeader } from "@/components/layout/MainHeader";
import { MainFooter } from "@/components/layout/MainFooter";

const { Content } = Layout;

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <Layout className="flex flex-col !min-h-screen bg-transparent">
      <MainHeader />

      <Content className="flex-1 flex flex-col justify-start">
        {children}
      </Content>

      <MainFooter />
    </Layout>
  );
}
