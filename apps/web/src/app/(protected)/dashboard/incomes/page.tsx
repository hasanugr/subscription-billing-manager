"use client";

import { useState } from "react";
import {
  Layout,
  Card,
  Typography,
  Space,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  FilterOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import {
  useGetIncomesQuery,
  useCreateIncomeMutation,
  useUpdateIncomeMutation,
  useDeleteIncomeMutation,
  useGetCategoriesQuery,
  Income,
  RecurrencePeriod,
  Category,
} from "@sbm/api-client";

const { Content } = Layout;
const { Title, Text } = Typography;

interface IncomeFormValues {
  categoryId: string;
  amount: number;
  currency: string;
  date: Dayjs;
  recurrencePeriod: RecurrencePeriod;
  note?: string;
}

export default function IncomesPage() {
  const { data, isLoading } = useGetIncomesQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createIncome, { isLoading: isCreating }] = useCreateIncomeMutation();
  const [updateIncome, { isLoading: isUpdating }] = useUpdateIncomeMutation();
  const [deleteIncome, { isLoading: isDeleting }] = useDeleteIncomeMutation();

  const incomes: Income[] = data ?? [];
  const incomeCategories =
    categoriesData?.filter((c: Category) => c.type === "INCOME") ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [form] = Form.useForm<IncomeFormValues>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">(
    "all"
  );

  const totalThisMonth = incomes.reduce((acc, e) => {
    const d = dayjs(e.date);
    const now = dayjs();
    if (d.month() === now.month() && d.year() === now.year()) {
      return acc + e.amount;
    }
    return acc;
  }, 0);

  const filteredIncomes = incomes.filter((e) =>
    selectedCategoryId === "all" ? true : e.categoryId === selectedCategoryId
  );

  const openCreate = () => {
    setEditingIncome(null);
    form.resetFields();
    form.setFieldsValue({
      currency: "TRY",
      recurrencePeriod: "NONE",
      date: dayjs(),
    });
    setIsModalOpen(true);
  };

  const openEdit = (income: Income) => {
    setEditingIncome(income);
    form.setFieldsValue({
      categoryId: income.categoryId,
      amount: income.amount,
      currency: income.currency,
      recurrencePeriod: income.recurrencePeriod,
      note: income.note ?? undefined,
      date: dayjs(income.date),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        date: values.date.toISOString(),
      };

      if (editingIncome) {
        await updateIncome({
          id: editingIncome.id,
          ...payload,
        }).unwrap();
        message.success("Gelir güncellendi.");
      } else {
        await createIncome(payload).unwrap();
        message.success("Gelir eklendi.");
      }

      setIsModalOpen(false);
      setEditingIncome(null);
      form.resetFields();
    } catch {
      message.error("İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteIncome({ id }).unwrap();
      message.success("Gelir silindi.");
    } catch {
      message.error("Gelir silinirken bir hata oluştu.");
    }
  };

  return (
    <Content className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <Title level={3} className="!mb-0">
            Gelirler
          </Title>
          <Text className="text-sm opacity-70">
            Maaş, ek gelir ve diğer tüm kazançlarını burada takip et.
          </Text>
        </div>

        <Card
          variant="borderless"
          className="bg-emerald-500/10 border border-emerald-400/30 rounded-2xl shadow-sm px-4 py-2"
        >
          <Space size="small">
            <ArrowUpOutlined className="text-emerald-300" />
            <Text className="text-sm opacity-90">
              Bu ayki toplam gelir:{" "}
              <span className="font-semibold text-emerald-100">
                {totalThisMonth.toLocaleString("tr-TR", {
                  maximumFractionDigits: 0,
                })}{" "}
                ₺
              </span>
            </Text>
          </Space>
        </Card>
      </div>

      <Card
        variant="outlined"
        className="rounded-2xl shadow-sm"
        title={
          <Space>
            <FilterOutlined />
            <span>Gelir listesi</span>
          </Space>
        }
        extra={
          <Space size="small">
            <Select
              value={selectedCategoryId}
              onChange={(val) => setSelectedCategoryId(val)}
              style={{ minWidth: 180 }}
              options={[
                { label: "Tüm kategoriler", value: "all" },
                ...incomeCategories.map((c: Category) => ({
                  label: c.name,
                  value: c.id,
                })),
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Yeni gelir ekle
            </Button>
          </Space>
        }
      >
        <Table<Income>
          rowKey="id"
          loading={isLoading}
          dataSource={filteredIncomes}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          className="mt-2"
          columns={[
            {
              title: "Tarih",
              dataIndex: "date",
              key: "date",
              render: (value: string) => (
                <Text className="text-sm opacity-90">
                  {dayjs(value).format("DD MMM YYYY")}
                </Text>
              ),
            },
            {
              title: "Kategori",
              dataIndex: ["category", "name"],
              key: "category",
              render: (_value, record) => (
                <Text className="text-sm opacity-90">
                  {record.category?.name ?? "-"}
                </Text>
              ),
            },
            {
              title: "Açıklama",
              dataIndex: "note",
              key: "note",
              render: (value?: string) => (
                <Text className="text-xs opacity-70">{value || "—"}</Text>
              ),
            },
            {
              title: "Tutar",
              key: "amount",
              render: (_value, record) => (
                <Text className="text-emerald-300 font-semibold text-sm">
                  +
                  {record.amount.toLocaleString("tr-TR", {
                    maximumFractionDigits: 0,
                  })}{" "}
                  {record.currency === "TRY" ? "₺" : record.currency}
                </Text>
              ),
            },
            {
              title: "Tekrar",
              dataIndex: "recurrencePeriod",
              key: "recurrencePeriod",
              render: (value: RecurrencePeriod) => {
                if (value === "NONE") {
                  return (
                    <Tag
                      color="default"
                      className="rounded-full px-3 text-[11px]"
                    >
                      Tek seferlik
                    </Tag>
                  );
                }

                const label =
                  value === "WEEKLY"
                    ? "Haftalık"
                    : value === "MONTHLY"
                    ? "Aylık"
                    : "Yıllık";

                return (
                  <Tag
                    color="success"
                    className="rounded-full px-3 text-[11px]"
                  >
                    {label}
                  </Tag>
                );
              },
            },
            {
              title: "İşlemler",
              key: "actions",
              width: 170,
              render: (_value, record) => (
                <Space size="small">
                  <Button size="small" onClick={() => openEdit(record)}>
                    Düzenle
                  </Button>
                  <Popconfirm
                    title="Geliri sil"
                    description="Bu geliri silmek istediğine emin misin?"
                    okText="Evet"
                    cancelText="Vazgeç"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button size="small" danger loading={isDeleting}>
                      Sil
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingIncome ? "Geliri düzenle" : "Yeni gelir ekle"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingIncome(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={isCreating || isUpdating}
        okText={editingIncome ? "Güncelle" : "Ekle"}
        cancelText="Vazgeç"
      >
        <Form<IncomeFormValues> form={form} layout="vertical">
          <Form.Item
            label="Kategori"
            name="categoryId"
            rules={[{ required: true, message: "Lütfen kategori seç." }]}
          >
            <Select
              placeholder="Kategori seç"
              options={incomeCategories.map((c: Category) => ({
                label: c.name,
                value: c.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Tutar"
            name="amount"
            rules={[{ required: true, message: "Lütfen tutar gir." }]}
          >
            <Input type="number" min={0} step="0.01" />
          </Form.Item>

          <Form.Item
            label="Para birimi"
            name="currency"
            rules={[{ required: true, message: "Lütfen para birimi seç." }]}
          >
            <Select
              options={[
                { label: "TL (₺)", value: "TRY" },
                { label: "USD ($)", value: "USD" },
                { label: "EUR (€)", value: "EUR" },
                { label: "GBP (£)", value: "GBP" },
                { label: "Diğer", value: "OTHER" },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Tarih"
            name="date"
            rules={[{ required: true, message: "Lütfen tarih seç." }]}
          >
            <DatePicker
              className="w-full"
              format="DD.MM.YYYY"
              suffixIcon={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item label="Tekrar" name="recurrencePeriod">
            <Select
              options={[
                { label: "Tek seferlik", value: "NONE" },
                { label: "Haftalık", value: "WEEKLY" },
                { label: "Aylık", value: "MONTHLY" },
                { label: "Yıllık", value: "YEARLY" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Not" name="note">
            <Input.TextArea rows={3} placeholder="İsteğe bağlı açıklama" />
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}
