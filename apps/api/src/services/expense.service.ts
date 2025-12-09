import { prisma } from "../config/prisma";
import type { RecurrencePeriod } from "@prisma/client";

type Currency = string;

export async function listExpensesForUser(userId: string) {
  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 100,
    include: {
      category: true,
    },
  });

  return expenses;
}

export async function createExpenseForUser(params: {
  userId: string;
  categoryId: string;
  amount: number;
  currency: Currency;
  date: Date;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: Date | null;
  recurrenceEnd?: Date | null;
  isSubscription?: boolean;
  note?: string | null;
}) {
  const {
    userId,
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod = "NONE",
    recurrenceStart,
    recurrenceEnd,
    isSubscription = false,
    note,
  } = params;

  if (amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  if (category.type !== "EXPENSE") {
    throw new Error("CATEGORY_TYPE_MISMATCH");
  }

  if (!category.isGlobal && category.userId !== userId) {
    throw new Error("FORBIDDEN_CATEGORY");
  }

  const expense = await prisma.expense.create({
    data: {
      userId,
      categoryId,
      amount,
      currency,
      date,
      recurrencePeriod,
      recurrenceStart: recurrenceStart ?? null,
      recurrenceEnd: recurrenceEnd ?? null,
      isSubscription,
      note: note ?? null,
    },
  });

  return expense;
}

export async function updateExpenseForUser(params: {
  userId: string;
  expenseId: string;
  categoryId?: string;
  amount?: number;
  currency?: Currency;
  date?: Date;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: Date | null;
  recurrenceEnd?: Date | null;
  isSubscription?: boolean;
  note?: string | null;
}) {
  const {
    userId,
    expenseId,
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod,
    recurrenceStart,
    recurrenceEnd,
    isSubscription,
    note,
  } = params;

  const existing = await prisma.expense.findUnique({
    where: { id: expenseId },
    include: { category: true },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  let nextCategoryId = existing.categoryId;

  if (categoryId && categoryId !== existing.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
    }

    if (category.type !== "EXPENSE") {
      throw new Error("CATEGORY_TYPE_MISMATCH");
    }

    if (!category.isGlobal && category.userId !== userId) {
      throw new Error("FORBIDDEN_CATEGORY");
    }

    nextCategoryId = categoryId;
  }

  if (amount !== undefined && amount <= 0) {
    throw new Error("INVALID_AMOUNT");
  }

  const updated = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      categoryId: nextCategoryId,
      amount: amount ?? existing.amount,
      currency: currency ?? existing.currency,
      date: date ?? existing.date,
      recurrencePeriod: recurrencePeriod ?? existing.recurrencePeriod,
      recurrenceStart: recurrenceStart ?? existing.recurrenceStart,
      recurrenceEnd: recurrenceEnd ?? existing.recurrenceEnd,
      isSubscription: isSubscription ?? existing.isSubscription,
      note: note ?? existing.note,
    },
  });

  return updated;
}

export async function deleteExpenseForUser(params: {
  userId: string;
  expenseId: string;
}) {
  const { userId, expenseId } = params;

  const existing = await prisma.expense.findUnique({
    where: { id: expenseId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  await prisma.expense.delete({
    where: { id: expenseId },
  });

  return true;
}
