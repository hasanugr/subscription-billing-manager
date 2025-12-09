import { prisma } from "../config/prisma";

export type CategoryType = "INCOME" | "EXPENSE";

export async function listCategoriesForUser(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      OR: [
        { isGlobal: true }, // Global categories
        { userId }, // User-specific categories
      ],
    },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });

  return categories;
}

export async function createCategoryForUser(params: {
  userId: string;
  name: string;
  type: CategoryType;
  isGlobal?: boolean;
}) {
  const { userId, name, type, isGlobal = false } = params;

  if (!name.trim()) {
    throw new Error("INVALID_NAME");
  }

  const category = await prisma.category.create({
    data: {
      name: name.trim(),
      type,
      isGlobal,
      userId: isGlobal ? null : userId,
    },
  });

  return category;
}

export async function updateCategoryForUser(params: {
  userId: string;
  categoryId: string;
  name?: string;
  type?: CategoryType;
}) {
  const { userId, categoryId, name, type } = params;

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.isGlobal) {
    throw new Error("FORBIDDEN_GLOBAL_CATEGORY");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  const updated = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: name?.trim() ?? existing.name,
      type: type ?? existing.type,
    },
  });

  return updated;
}

export async function deleteCategoryForUser(params: {
  userId: string;
  categoryId: string;
}) {
  const { userId, categoryId } = params;

  const existing = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      expenses: true,
      incomes: true,
    },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.isGlobal) {
    throw new Error("FORBIDDEN_GLOBAL_CATEGORY");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  if (existing.expenses.length > 0 || existing.incomes.length > 0) {
    throw new Error("HAS_LINKED_RECORDS");
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  return true;
}
