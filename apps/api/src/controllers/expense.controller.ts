import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import type { RecurrencePeriod } from "@prisma/client";
import {
  listExpensesForUser,
  createExpenseForUser,
  updateExpenseForUser,
  deleteExpenseForUser,
} from "../services/expense.service";

export async function listExpensesHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const expenses = await listExpensesForUser(req.user.id);

  return res.json({
    data: expenses,
    error: null,
  });
}

export async function createExpenseHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const {
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod,
    recurrenceStart,
    recurrenceEnd,
    isSubscription,
    note,
  } = req.body as {
    categoryId?: string;
    amount?: number;
    currency?: string;
    date?: string;
    recurrencePeriod?: RecurrencePeriod;
    recurrenceStart?: string | null;
    recurrenceEnd?: string | null;
    isSubscription?: boolean;
    note?: string | null;
  };

  if (!categoryId || amount === undefined || !currency || !date) {
    return res.status(400).json({
      data: null,
      error: { message: "categoryId, amount, currency and date are required" },
    });
  }

  try {
    const expense = await createExpenseForUser({
      userId: req.user.id,
      categoryId,
      amount: Number(amount),
      currency,
      date: new Date(date),
      recurrencePeriod,
      recurrenceStart: recurrenceStart ? new Date(recurrenceStart) : null,
      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
      isSubscription,
      note,
    });

    return res.status(201).json({
      data: expense,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "INVALID_AMOUNT") {
        return res.status(400).json({
          data: null,
          error: { message: "Amount must be greater than zero" },
        });
      }

      if (err.message === "CATEGORY_NOT_FOUND") {
        return res.status(400).json({
          data: null,
          error: { message: "Category not found" },
        });
      }

      if (err.message === "CATEGORY_TYPE_MISMATCH") {
        return res.status(400).json({
          data: null,
          error: { message: "Category type must be EXPENSE" },
        });
      }

      if (err.message === "FORBIDDEN_CATEGORY") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to use this category" },
        });
      }
    }

    console.error("[expense.create]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function updateExpenseHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const expenseId = req.params.id;

  const {
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod,
    recurrenceStart,
    recurrenceEnd,
    isSubscription,
    note,
  } = req.body as {
    categoryId?: string;
    amount?: number;
    currency?: string;
    date?: string;
    recurrencePeriod?: RecurrencePeriod;
    recurrenceStart?: string | null;
    recurrenceEnd?: string | null;
    isSubscription?: boolean;
    note?: string | null;
  };

  try {
    const expense = await updateExpenseForUser({
      userId: req.user.id,
      expenseId,
      categoryId,
      amount: amount !== undefined ? Number(amount) : undefined,
      currency,
      date: date ? new Date(date) : undefined,
      recurrencePeriod,
      recurrenceStart: recurrenceStart ? new Date(recurrenceStart) : undefined,
      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : undefined,
      isSubscription,
      note,
    });

    return res.json({
      data: expense,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Expense not found" },
        });
      }

      if (err.message === "FORBIDDEN") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to update this expense" },
        });
      }

      if (err.message === "INVALID_AMOUNT") {
        return res.status(400).json({
          data: null,
          error: { message: "Amount must be greater than zero" },
        });
      }

      if (err.message === "CATEGORY_NOT_FOUND") {
        return res.status(400).json({
          data: null,
          error: { message: "Category not found" },
        });
      }

      if (err.message === "CATEGORY_TYPE_MISMATCH") {
        return res.status(400).json({
          data: null,
          error: { message: "Category type must be EXPENSE" },
        });
      }

      if (err.message === "FORBIDDEN_CATEGORY") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to use this category" },
        });
      }
    }

    console.error("[expense.update]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function deleteExpenseHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const expenseId = req.params.id;

  try {
    await deleteExpenseForUser({
      userId: req.user.id,
      expenseId,
    });

    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Expense not found" },
        });
      }

      if (err.message === "FORBIDDEN") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to delete this expense" },
        });
      }
    }

    console.error("[expense.delete]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}
