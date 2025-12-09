import { prisma } from "../config/prisma";
import type { RecurrencePeriod } from "@prisma/client";

type Currency = string;

export async function listIncomesForUser(userId: string) {
  const incomes = await prisma.income.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 100,
    include: { category: true },
  });

  return incomes;
}

export async function createIncomeForUser(params: {
  userId: string;
  categoryId: string;
  amount: number;
  currency: Currency;
  date: Date;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: Date | null;
  recurrenceEnd?: Date | null;
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

  if (category.type !== "INCOME") {
    throw new Error("CATEGORY_TYPE_MISMATCH");
  }

  if (!category.isGlobal && category.userId !== userId) {
    throw new Error("FORBIDDEN_CATEGORY");
  }

  const income = await prisma.income.create({
    data: {
      userId,
      categoryId,
      amount,
      currency,
      date,
      recurrencePeriod,
      recurrenceStart: recurrenceStart ?? null,
      recurrenceEnd: recurrenceEnd ?? null,
      note: note ?? null,
    },
  });

  return income;
}

export async function updateIncomeForUser(params: {
  userId: string;
  incomeId: string;
  categoryId?: string;
  amount?: number;
  currency?: Currency;
  date?: Date;
  recurrencePeriod?: RecurrencePeriod;
  recurrenceStart?: Date | null;
  recurrenceEnd?: Date | null;
  note?: string | null;
}) {
  const {
    userId,
    incomeId,
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod,
    recurrenceStart,
    recurrenceEnd,
    note,
  } = params;

  const existing = await prisma.income.findUnique({
    where: { id: incomeId },
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

    if (category.type !== "INCOME") {
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

  const updated = await prisma.income.update({
    where: { id: incomeId },
    data: {
      categoryId: nextCategoryId,
      amount: amount ?? existing.amount,
      currency: currency ?? existing.currency,
      date: date ?? existing.date,
      recurrencePeriod: recurrencePeriod ?? existing.recurrencePeriod,
      recurrenceStart: recurrenceStart ?? existing.recurrenceStart,
      recurrenceEnd: recurrenceEnd ?? existing.recurrenceEnd,
      note: note ?? existing.note,
    },
  });

  return updated;
}

export async function deleteIncomeForUser(params: {
  userId: string;
  incomeId: string;
}) {
  const { userId, incomeId } = params;

  const existing = await prisma.income.findUnique({
    where: { id: incomeId },
  });

  if (!existing) {
    throw new Error("NOT_FOUND");
  }

  if (existing.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  await prisma.income.delete({
    where: { id: incomeId },
  });

  return true;
}
