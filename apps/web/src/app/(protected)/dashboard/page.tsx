"use client";

import { useState } from "react";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Statistic,
  Tag,
  Space,
  Button,
  Avatar,
  Progress,
  Divider,
  Segmented,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  PlusOutlined,
  BarChartOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title, Text } = Typography;
const { Content } = Layout;

// ──────────────────────────────────────
// Mock data - to be replaced with real API data
// ──────────────────────────────────────

const summary = {
  totalIncome: 12500,
  totalExpense: 8400,
  balance: 4100,
  subscriptionsMonthly: 3200,
};

const recentActivity = [
  {
    id: "1",
    type: "expense" as const,
    label: "Netflix Premium",
    category: "Abonelik",
    amount: 249.99,
    currency: "TRY",
    date: "10 Aralık",
    note: "Aylık abonelik",
  },
  {
    id: "2",
    type: "expense" as const,
    label: "Market",
    category: "Gıda",
    amount: 780,
    currency: "TRY",
    date: "09 Aralık",
    note: "Haftalık alışveriş",
  },
  {
    id: "3",
    type: "income" as const,
    label: "Maaş",
    category: "Düzenli gelir",
    amount: 12000,
    currency: "TRY",
    date: "01 Aralık",
    note: "Net maaş",
  },
  {
    id: "4",
    type: "expense" as const,
    label: "Spotify",
    category: "Abonelik",
    amount: 59.99,
    currency: "TRY",
    date: "01 Aralık",
    note: "Aile planı",
  },
];

const upcomingRecurring = [
  {
    id: "1",
    name: "Netflix",
    date: "15 Aralık",
    amount: 249.99,
    currency: "TRY",
    recurrence: "Aylık",
    risk: "medium" as const,
  },
  {
    id: "2",
    name: "Spotify",
    date: "01 Ocak",
    amount: 59.99,
    currency: "TRY",
    recurrence: "Aylık",
    risk: "low" as const,
  },
  {
    id: "3",
    name: "Ev kirası",
    date: "01 Ocak",
    amount: 18500,
    currency: "TRY",
    recurrence: "Aylık",
    risk: "high" as const,
  },
];

const quickInsights = [
  "Bu ayki giderlerin geçen aya göre %12 arttı.",
  "Abonelik giderlerin toplam giderlerinin %38'ini oluşturuyor.",
  "En çok harcama yaptığın kategori: Gıda.",
  "Düzenli gelirlerin, düzenli giderlerini şu an karşılıyor.",
];

// ──────────────────────────────────────
// Dashboard Page
// ──────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();

  const [range, setRange] = useState<
    "this-month" | "last-month" | "three-months"
  >("this-month");

  const hasAnyData = recentActivity.length > 0 || upcomingRecurring.length > 0;
  // İleride burayı gerçek data kontrolüne dönüştüreceğiz (ör: totals, count vs)
  const hasFlowData = hasAnyData; // istersen şimdilik false yapıp boş state'i test edebilirsin

  const expenseRatio = hasAnyData
    ? Math.round((summary.totalExpense / summary.totalIncome) * 100)
    : 0;
  const subscriptionRatio = hasAnyData
    ? Math.round((summary.subscriptionsMonthly / summary.totalExpense) * 100)
    : 0;

  return (
    <Content className="flex flex-col gap-8 pb-10">
      {!hasAnyData && (
        <Card
          variant="borderless"
          className="rounded-2xl shadow-sm bg-gradient-to-r from-emerald-50 via-sky-50 to-violet-50 border border-emerald-200 dark:from-emerald-500/15 dark:via-sky-500/10 dark:to-violet-500/15 dark:border-emerald-400/30"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <Text className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-300">
                Hoş geldin
              </Text>
              <Title level={4} className="!mb-1">
                İlk finans dashboard&apos;unu birlikte oluşturalım.
              </Title>
              <Text className="text-sm opacity-80">
                Başlamak için birkaç küçük adım yeterli: kategori seç, ilk
                giderini ekle ve aboneliklerini işaretle. Sonra tüm özetleri
                burada göreceksin.
              </Text>
            </div>
            <Space orientation="vertical" size="small">
              <Button
                type="primary"
                size="middle"
                icon={<PlusOutlined />}
                onClick={() => router.push("/dashboard/expenses/new")}
              >
                İlk giderini ekle
              </Button>
              <Button
                type="default"
                size="small"
                onClick={() => router.push("/dashboard/categories")}
              >
                Kategori oluştur
              </Button>
            </Space>
          </div>
        </Card>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <Title level={3} className="!mb-0">
            Aylık özet
          </Title>
          <Text className="text-sm opacity-70">
            Aboneliklerin, gelir ve giderlerin için hızlı bir genel bakış.
          </Text>
        </div>

        <Space orientation="horizontal" size="middle">
          <Segmented
            size="small"
            value={range}
            onChange={(val) => setRange(val as typeof range)}
            options={[
              { label: "Bu ay", value: "this-month" },
              { label: "Geçen ay", value: "last-month" },
              { label: "Son 3 ay", value: "three-months" },
            ]}
          />
          <Button icon={<CalendarOutlined />} size="small" type="default">
            Ayrıntılı tarih seç
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            className="bg-emerald-500/10 border border-emerald-400/50 rounded-2xl shadow-sm h-full"
          >
            <div className="flex flex-col justify-between gap-3">
              <Statistic
                title={
                  <span className="text-emerald-400/80">Toplam gelir</span>
                }
                value={summary.totalIncome}
                precision={0}
                suffix="₺"
                styles={{
                  content: {
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: 24,
                  },
                }}
              />
              <div className="flex items-center justify-between text-xs text-emerald-400/80">
                <span className="flex items-center gap-1">
                  <ArrowUpOutlined />
                  Geçen aya göre +%8
                </span>
                <Tag color="success" className="rounded-full px-2 text-[11px]">
                  Düzenli gelirler stabil
                </Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            className="bg-rose-500/10 border border-rose-400/50 rounded-2xl shadow-sm h-full"
          >
            <div className="flex flex-col justify-between gap-3">
              <Statistic
                title={<span className="text-rose-400/80">Toplam gider</span>}
                value={summary.totalExpense}
                precision={0}
                suffix="₺"
                styles={{
                  content: {
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: 24,
                  },
                }}
              />
              <div className="flex items-center justify-between text-xs text-rose-400/80">
                <span className="flex items-center gap-1">
                  <ArrowDownOutlined />
                  Geçen aya göre +%12
                </span>
                <Tag
                  color="processing"
                  className="rounded-full px-2 text-[11px]"
                >
                  Abonelik etkisi yüksek
                </Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            variant="borderless"
            className="bg-sky-500/10 border border-sky-400/50 rounded-2xl shadow-sm h-full"
          >
            <div className="flex flex-col justify-between gap-3">
              <Statistic
                title={<span className="text-sky-400/80">Aylık denge</span>}
                value={summary.balance}
                precision={0}
                suffix="₺"
                styles={{
                  content: {
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: 24,
                  },
                }}
              />
              <div className="flex items-center justify-between text-xs text-sky-400/80">
                <span>Hedeflediğin ay sonu bakiyesine yakınsın.</span>
                <Button
                  type="link"
                  size="small"
                  className="!p-0 text-sky-50"
                  icon={<ArrowRightOutlined />}
                  onClick={() => router.push("/dashboard/expenses")}
                >
                  Giderleri incele
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            variant="outlined"
            className="rounded-2xl shadow-sm h-full"
            title={
              <Space>
                <BarChartOutlined />
                <span>Gelir & gider akışı</span>
              </Space>
            }
            extra={
              hasFlowData && (
                <Button
                  type="link"
                  size="small"
                  onClick={() => router.push("/dashboard/expenses")}
                >
                  Detaylı rapora git
                </Button>
              )
            }
          >
            {hasFlowData ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-end gap-2 h-24 mt-1">
                  {[35, 60, 45, 80, 50, 70].map((h, idx) => (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col justify-end gap-1"
                    >
                      <div
                        className="mx-auto w-3 rounded-full bg-emerald-400/70"
                        style={{ height: `${h}%` }}
                      />
                      <div
                        className="mx-auto w-3 rounded-full bg-sky-400/70"
                        style={{ height: `${100 - h}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[11px] opacity-60">
                  <span>Son 6 dönem</span>
                  <span>Yeşil: Gelir · Mavi: Gider</span>
                </div>

                <Divider />

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <div className="space-y-1">
                      <Text className="text-xs opacity-90">
                        Gider / Gelir oranı
                      </Text>
                      <Progress
                        percent={expenseRatio}
                        size="small"
                        status={expenseRatio > 85 ? "exception" : "active"}
                        strokeColor={expenseRatio > 85 ? "#fb7185" : "#22c55e"}
                      />
                      <Text className="text-[11px] opacity-60">
                        Harcamaların gelirinin {expenseRatio}%’ine denk geliyor.
                      </Text>
                    </div>
                  </Col>
                  <Col xs={24} md={12}>
                    <div className="space-y-1">
                      <Text className="text-slate-200 text-xs">
                        Aboneliklerin gider içindeki payı
                      </Text>
                      <Progress
                        percent={subscriptionRatio}
                        size="small"
                        status={subscriptionRatio > 40 ? "exception" : "active"}
                        strokeColor={
                          subscriptionRatio > 40 ? "#eab308" : "#38bdf8"
                        }
                      />
                      <Text className="text-[11px] opacity-60">
                        Aboneliklerin toplam giderinin {subscriptionRatio}%’ini
                        oluşturuyor.
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                  <BarChartOutlined className="opacity-70" />
                </div>
                <Text className="text-sm opacity-90">
                  Henüz bu dönem için kayıtlı veri yok.
                </Text>
                <Text className="text-xs max-w-xs opacity-60">
                  Gelir ve gider eklemeye başladığında burada aylık akışını ve
                  abonelik etkisini görmeye başlayacaksın.
                </Text>
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => router.push("/dashboard/expenses/new")}
                >
                  İlk giderini ekle
                </Button>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            variant="outlined"
            className="rounded-2xl shadow-sm mb-4"
            title="Hızlı içgörüler"
          >
            <div className="space-y-1.5">
              {quickInsights.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <Text className="text-[13px] opacity-90">{item}</Text>
                </div>
              ))}
            </div>
          </Card>

          <Card
            variant="outlined"
            className="rounded-2xl shadow-sm"
            title="Hızlı aksiyonlar"
          >
            <Space orientation="vertical" className="w-full" size="middle">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                block
                size="middle"
                onClick={() => router.push("/dashboard/expenses/new")}
              >
                Yeni gider ekle
              </Button>
              <Button
                icon={<PlusOutlined />}
                block
                size="middle"
                onClick={() => router.push("/dashboard/incomes/new")}
              >
                Yeni gelir ekle
              </Button>
              <Button
                icon={<PlusOutlined />}
                block
                size="middle"
                onClick={() => router.push("/dashboard/categories")}
              >
                Yeni kategori oluştur
              </Button>
              <Button
                type="dashed"
                icon={<BarChartOutlined />}
                block
                size="middle"
                onClick={() => router.push("/dashboard/subscriptions")}
              >
                Aboneliklerini yönet
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={10}>
          <Card
            variant="outlined"
            className="rounded-2xl shadow-sm h-full"
            style={{ minHeight: 260 }}
            title="Yaklaşan ödemeler"
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => router.push("/dashboard/subscriptions")}
              >
                Tümünü gör
              </Button>
            }
          >
            <div className="space-y-2">
              {upcomingRecurring.map((item) => {
                const tagColor =
                  item.risk === "high"
                    ? "error"
                    : item.risk === "medium"
                    ? "warning"
                    : "success";

                return (
                  <div key={item.id} className="flex items-start gap-3 py-2">
                    <Avatar className="bg-emerald-500/70">
                      {item.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <Text className="text-sm opacity-90">{item.name}</Text>
                        <Text className="text-sm font-medium opacity-90">
                          {item.amount.toLocaleString("tr-TR", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          {item.currency === "TRY" ? "₺" : item.currency}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] opacity-60">
                        <span>
                          {item.recurrence} · Sonraki ödeme: {item.date}
                        </span>
                        <Tag color={tagColor} className="rounded-full px-2">
                          {item.risk === "high"
                            ? "Dikkat"
                            : item.risk === "medium"
                            ? "Orta seviye"
                            : "Konforlu"}
                        </Tag>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            variant="outlined"
            className="rounded-2xl shadow-sm h-full"
            style={{ minHeight: 260 }}
            title="Son hareketler"
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => router.push("/dashboard/expenses")}
              >
                Tümünü gör
              </Button>
            }
          >
            <div className="space-y-0">
              {recentActivity.map((item) => {
                const isIncome = item.type === "income";
                const isSubscription = item.category === "Abonelik";

                return (
                  <div
                    key={item.id}
                    className="py-2 last:border-b-0 border-b border-slate-200 dark:border-slate-800/60"
                  >
                    <div className="flex w-full items-center justify-between gap-3">
                      <div className="flex flex-col">
                        <Text className="text-sm opacity-90">{item.label}</Text>
                        <div className="flex items-center gap-2 text-[11px] opacity-60">
                          <span>{item.date}</span>
                          <span>·</span>
                          <span>{item.category}</span>
                          {item.note && (
                            <>
                              <span>·</span>
                              <span>{item.note}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isSubscription && (
                          <Tag
                            color="processing"
                            className="rounded-full px-2 text-[11px]"
                          >
                            Abonelik
                          </Tag>
                        )}
                        <Text
                          className={`text-sm font-semibold ${
                            isIncome ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {item.amount.toLocaleString("tr-TR", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          {item.currency === "TRY" ? "₺" : item.currency}
                        </Text>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </Content>
  );
}
