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
  Popconfirm,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  Category,
  CategoryType,
} from "@sbm/api-client";

const { Content } = Layout;
const { Title, Text } = Typography;

interface CategoryFormValues {
  name: string;
  type: CategoryType;
}

export default function CategoriesPage() {
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  const categories: Category[] = data ?? [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm<CategoryFormValues>();

  const handleOpenCreate = () => {
    setEditingCategory(null);
    form.resetFields();
    form.setFieldsValue({ type: "EXPENSE" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      type: category.type,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          ...values,
        }).unwrap();
        message.success("Kategori güncellendi.");
      } else {
        await createCategory({
          name: values.name,
          type: values.type,
        }).unwrap();
        message.success("Kategori oluşturuldu.");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      form.resetFields();
    } catch (err) {
      if (err && typeof err === "object") {
        message.error("İşlem sırasında bir hata oluştu.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory({ id }).unwrap();
      message.success("Kategori silindi.");
    } catch {
      message.error("Kategori silinirken bir hata oluştu.");
    }
  };

  return (
    <Content className="flex flex-col gap-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <Title level={3} className="!mb-0">
            Kategoriler
          </Title>
          <Text className="text-sm opacity-70">
            Gelir ve giderlerini gruplayarak raporları daha anlamlı hale getir.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
        >
          Yeni kategori ekle
        </Button>
      </div>

      <Card
        variant="outlined"
        className="rounded-2xl shadow-sm"
        title={
          <Space>
            <FolderOpenOutlined />
            <span>Kategori listesi</span>
          </Space>
        }
      >
        <Table<Category>
          rowKey="id"
          loading={isLoading}
          dataSource={categories}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          className="mt-2"
          columns={[
            {
              title: "Kategori adı",
              dataIndex: "name",
              key: "name",
              render: (value: string) => (
                <Text className="opacity-90">{value}</Text>
              ),
            },
            {
              title: "Tür",
              dataIndex: "type",
              key: "type",
              render: (type: CategoryType) => (
                <Tag
                  color={type === "INCOME" ? "success" : "processing"}
                  className="rounded-full px-3 text-[11px]"
                >
                  {type === "INCOME" ? "Gelir" : "Gider"}
                </Tag>
              ),
            },
            {
              title: "Kapsam",
              dataIndex: "isGlobal",
              key: "isGlobal",
              render: (isGlobal: boolean) =>
                isGlobal ? (
                  <Tag
                    color="default"
                    className="rounded-full px-3 text-[11px]"
                  >
                    Global
                  </Tag>
                ) : (
                  <Tag
                    color="geekblue"
                    className="rounded-full px-3 text-[11px]"
                  >
                    Bu hesap
                  </Tag>
                ),
            },
            {
              title: "İşlemler",
              key: "actions",
              width: 170,
              render: (_value, record) => (
                <Space size="small">
                  <Button
                    size="small"
                    type="default"
                    icon={<EditOutlined />}
                    onClick={() => handleOpenEdit(record)}
                  >
                    Düzenle
                  </Button>
                  <Popconfirm
                    title="Kategoriyi sil"
                    description="Bu kategoriye bağlı hareketler varsa raporlar etkilenebilir. Emin misin?"
                    okText="Evet"
                    cancelText="Vazgeç"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      loading={isDeleting}
                    />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>

      <Modal
        title={editingCategory ? "Kategoriyi düzenle" : "Yeni kategori ekle"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={handleSubmit}
        confirmLoading={isCreating || isUpdating}
        okText={editingCategory ? "Güncelle" : "Oluştur"}
        cancelText="Vazgeç"
      >
        <Form<CategoryFormValues>
          form={form}
          layout="vertical"
          initialValues={{ type: "EXPENSE" }}
        >
          <Form.Item
            label="Kategori adı"
            name="name"
            rules={[{ required: true, message: "Lütfen kategori adını gir." }]}
          >
            <Input placeholder="Örn: Market, Maaş, Netflix" />
          </Form.Item>

          <Form.Item
            label="Tür"
            name="type"
            rules={[{ required: true, message: "Lütfen tür seç." }]}
          >
            <Select
              options={[
                { label: "Gider", value: "EXPENSE" },
                { label: "Gelir", value: "INCOME" },
              ]}
            />
          </Form.Item>

          <Text type="secondary" className="text-xs">
            Global kategoriler yalnızca admin panelden yönetilir. Burada sadece
            kendi hesabına ait kategoriler oluşturursun.
          </Text>
        </Form>
      </Modal>
    </Content>
  );
}
