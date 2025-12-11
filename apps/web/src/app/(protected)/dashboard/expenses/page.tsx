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
  ArrowDownOutlined,
  FilterOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import {
  useGetExpensesQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
  useGetCategoriesQuery,
  Expense,
  RecurrencePeriod,
  Category,
} from "@sbm/api-client";

const { Content } = Layout;
const { Title, Text } = Typography;

interface ExpenseFormValues {
  categoryId: string;
  amount: number;
  currency: string;
  date: Dayjs;
  recurrencePeriod: RecurrencePeriod;
  isSubscription: boolean;
  note?: string;
}

export default function ExpensesPage() {
  const { data, isLoading } = useGetExpensesQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createExpense, { isLoading: isCreating }] = useCreateExpenseMutation();
  const [updateExpense, { isLoading: isUpdating }] = useUpdateExpenseMutation();
  const [deleteExpense, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const expenses: Expense[] = data ?? [];
  const expenseCategories =
    categoriesData?.filter((c: Category) => c.type === "EXPENSE") ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form] = Form.useForm<ExpenseFormValues>();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string | "all">(
    "all"
  );

  const totalThisMonth = expenses.reduce((acc, e) => {
    const d = dayjs(e.date);
    const now = dayjs();
    if (d.month() === now.month() && d.year() === now.year()) {
      return acc + e.amount;
    }
    return acc;
  }, 0);

  const filteredExpenses = expenses.filter((e) =>
    selectedCategoryId === "all" ? true : e.categoryId === selectedCategoryId
  );

  const openCreate = () => {
    setEditingExpense(null);
    form.resetFields();
    form.setFieldsValue({
      currency: "TRY",
      recurrencePeriod: "NONE",
      isSubscription: false,
      date: dayjs(),
    });
    setIsModalOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditingExpense(expense);
    form.setFieldsValue({
      categoryId: expense.categoryId,
      amount: expense.amount,
      currency: expense.currency,
      recurrencePeriod: expense.recurrencePeriod,
      isSubscription: expense.isSubscription,
      note: expense.note ?? undefined,
      date: dayjs(expense.date),
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

      if (editingExpense) {
        await updateExpense({
          id: editingExpense.id,
          ...payload,
        }).unwrap();
        message.success("Gider güncellendi.");
      } else {
        await createExpense(payload).unwrap();
        message.success("Gider eklendi.");
      }

      setIsModalOpen(false);
      setEditingExpense(null);
      form.resetFields();
    } catch {
      message.error("İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExpense({ id }).unwrap();
      message.success("Gider silindi.");
    } catch {
      message.error("Gider silinirken bir hata oluştu.");
    }
  };

  return (
    <Content className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <Title level={3} className="!mb-0">
            Giderler
          </Title>
          <Text className="text-sm opacity-70">
            Aylık harcamalarını, aboneliklerini ve tekrar eden giderlerini
            burada yönet.
          </Text>
        </div>

        <Card
          variant="borderless"
          className="bg-rose-500/10 border border-rose-400/30 rounded-2xl shadow-sm px-4 py-2"
        >
          <Space size="small">
            <ArrowDownOutlined className="text-rose-300" />
            <Text className="text-sm opacity-90">
              Bu ayki toplam giderin:{" "}
              <span className="font-semibold text-rose-100">
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
            <span>Gider listesi</span>
          </Space>
        }
        extra={
          <Space size="small">
            <Select
              value={selectedCategoryId}
              onChange={(val) => setSelectedCategoryId(val)}
              style={{ minWidth: 180 }}
              options={[
                ...expenseCategories.map((c: Category) => ({
                  label: c.name,
                  value: c.id,
                })),
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
              Yeni gider ekle
            </Button>
          </Space>
        }
      >
        <Table<Expense>
          rowKey="id"
          loading={isLoading}
          dataSource={filteredExpenses}
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
                <Text className="text-rose-300 font-semibold text-sm">
                  -
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
                    color="processing"
                    className="rounded-full px-3 text-[11px]"
                  >
                    {label}
                  </Tag>
                );
              },
            },
            {
              title: "Tip",
              dataIndex: "isSubscription",
              key: "isSubscription",
              render: (isSubscription: boolean) =>
                isSubscription ? (
                  <Tag
                    color="geekblue"
                    className="rounded-full px-3 text-[11px]"
                  >
                    Abonelik
                  </Tag>
                ) : (
                  <Tag
                    color="default"
                    className="rounded-full px-3 text-[11px]"
                  >
                    Diğer
                  </Tag>
                ),
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
                    title="Gideri sil"
                    description="Bu gideri silmek istediğine emin misin?"
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

      {/* Gider Oluştur / Düzenle Modal */}
      <Modal
        title={editingExpense ? "Gideri düzenle" : "Yeni gider ekle"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingExpense(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={isCreating || isUpdating}
        okText={editingExpense ? "Güncelle" : "Ekle"}
        cancelText="Vazgeç"
      >
        <Form<ExpenseFormValues> form={form} layout="vertical">
          <Form.Item
            label="Kategori"
            name="categoryId"
            rules={[{ required: true, message: "Lütfen kategori seç." }]}
          >
            <Select
              options={expenseCategories.map((c: Category) => ({
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

          <Form.Item label="Abonelik mi?" name="isSubscription">
            <Select
              options={[
                { label: "Evet, abonelik", value: true },
                { label: "Hayır, diğer gider", value: false },
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
