"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Layout,
  Row,
  Col,
  Card,
  Typography,
  Button,
  Form,
  Input,
  Tag,
  Space,
  Divider,
} from "antd";
import { ArrowRightOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useLoginMutation } from "@sbm/api-client";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

export default function HomePage() {
  const router = useRouter();

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();

  const [formError, setFormError] = useState<string | null>(null);

  const handleFinish = async (values: { email: string; password: string }) => {
    setFormError(null);

    try {
      await login(values).unwrap();
      router.push("/dashboard");
    } catch (err) {
      console.error("login error", err);
      setFormError("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  };

  return (
    <Layout className="min-h-screen">
      <Content className="py-10 lg:py-16">
        <div className="mx-auto max-w-6xl px-4">
          <Row gutter={[32, 32]} align="middle">
            {/* HERO SOL */}
            <Col xs={24} lg={14}>
              <Space orientation="vertical" size="large" className="w-full">
                <Tag
                  color="green"
                  className="border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
                  icon={<ThunderboltOutlined />}
                >
                  Kişisel finans & abonelik takibi için tasarlandı
                </Tag>

                <Space orientation="vertical" size={12}>
                  <Title
                    level={1}
                    className="!text-3xl sm:!text-4xl lg:!text-5xl !leading-tight"
                  >
                    Tüm aboneliklerin,
                    <span className="text-emerald-400"> tek bir ekranda.</span>
                  </Title>
                  <Paragraph className="!text-sm sm:!text-base opacity-70 max-w-xl">
                    Netflix, Spotify, oyun platformları, faturalar, kira...
                    Hepsini tek bir yerde topla, anlık olarak gelir/gider
                    dengesini gör ve AI destekli önerilerle harcamalarını
                    optimize et.
                  </Paragraph>
                </Space>

                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Card variant="borderless" className="rounded-2xl">
                      <Text className="text-xs opacity-70">
                        Abonelik Takibi
                      </Text>
                      <Title level={4} className="!mt-1 !mb-1.5">
                        Otomatik görünürlük
                      </Title>
                      <Paragraph className="!text-xs opacity-70">
                        Yinelenen giderlerini kategorize ederek aktif
                        aboneliklerini net şekilde gör.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card variant="borderless" className="rounded-2xl">
                      <Text className="text-xs opacity-70">
                        Gelir &amp; Gider
                      </Text>
                      <Title level={4} className="!mt-1 !mb-1.5">
                        Net aylık durum
                      </Title>
                      <Paragraph className="!text-xs !text-slate-400">
                        Tüm gelir ve giderlerini tek tabloda gör, hangi
                        kategorinin bütçeni yediğini anında fark et.
                      </Paragraph>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Card
                      variant="borderless"
                      className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl"
                    >
                      <Text className="text-xs text-emerald-200/90">
                        AI Öneri Motoru
                      </Text>
                      <Title
                        level={4}
                        className="!mt-1 !mb-1.5 !text-emerald-50"
                      >
                        Akıllı tavsiyeler
                      </Title>
                      <Paragraph className="!text-xs !text-emerald-100/80">
                        Harcama alışkanlıklarına göre gereksiz abonelikleri
                        tespit eden kişisel öneriler.
                      </Paragraph>
                    </Card>
                  </Col>
                </Row>

                <Space size="large" wrap>
                  <Space size={8}>
                    <div className="h-6 w-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-[11px] text-emerald-300">
                      ✓
                    </div>
                    <Text className="text-xs opacity-70">
                      Aylık & yıllık tekrar eden ödemeleri ayrı izleme
                    </Text>
                  </Space>
                  <Space size={8}>
                    <div className="h-6 w-6 rounded-full bg-sky-400/20 flex items-center justify-center text-[11px] text-sky-300">
                      ⏱
                    </div>
                    <Text className="text-xs opacity-70">
                      3 dakikadan kısa sürede ilk dashboard&apos;unu oluştur
                    </Text>
                  </Space>
                </Space>

                <Button
                  type="link"
                  className="!text-emerald-300 !p-0 flex items-center gap-1 text-sm"
                  onClick={() => router.push("/demo")}
                  icon={null}
                >
                  Canlı bir örnek dashboard gör
                  <ArrowRightOutlined className="text-xs" />
                </Button>
              </Space>
            </Col>

            {/* LOGIN SAG */}
            <Col xs={24} lg={10} id="login-panel">
              <Card variant="borderless" className="rounded-3xl shadow-xl">
                <Space orientation="vertical" size={8} className="w-full">
                  <Title level={4} className="!mb-0">
                    Hesabına giriş yap
                  </Title>
                  <Text className="text-xs opacity-70">
                    Aboneliklerini yönetmek ve harcamalarını takip etmek için
                    oturum aç.
                  </Text>
                </Space>

                <Divider className="!my-4 !border-white/10" />

                <Form
                  layout="vertical"
                  onFinish={handleFinish}
                  requiredMark={false}
                >
                  <Form.Item
                    label={<span className="text-xs">E-posta</span>}
                    name="email"
                    rules={[
                      { required: true, message: "Lütfen e-posta girin." },
                      { type: "email", message: "Geçerli bir e-posta girin." },
                    ]}
                  >
                    <Input
                      size="large"
                      placeholder="ornek@mail.com"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label={<span className="text-xs">Şifre</span>}
                    name="password"
                    rules={[{ required: true, message: "Lütfen şifre girin." }]}
                  >
                    <Input.Password
                      size="large"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  {formError && (
                    <div className="text-xs text-red-400 mb-2">{formError}</div>
                  )}

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={isLoggingIn}
                    className="!mt-1"
                  >
                    Giriş yap
                  </Button>
                </Form>

                <Divider className="!my-4" />

                <Space orientation="vertical" size={4} className="w-full">
                  <div className="flex items-center justify-between text-xs opacity-70">
                    <span>Henüz hesabın yok mu?</span>
                    <Button
                      type="link"
                      size="small"
                      className="!p-0 !text-emerald-300"
                      onClick={() => router.push("/auth/register")}
                    >
                      Hemen kayıt ol
                    </Button>
                  </div>
                  <Text className="text-[11px] opacity-60">
                    Kayıt olduğunda aboneliklerini, gelir ve giderlerini
                    dilediğin para birimiyle yönetebilir, ileride eklenecek AI
                    özelliklerini de kullanmaya başlayabilirsin.
                  </Text>
                </Space>
              </Card>

              <Text className="block mt-3 text-[11px] opacity-60 text-center">
                Bu proje, gerçek dünyadaki abonelik ve gider senaryolarını
                modellemek için geliştirdiğin kişisel finans çalışma alanıdır.
              </Text>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
}
