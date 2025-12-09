import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import type { RecurrencePeriod } from "@prisma/client";
import {
  listIncomesForUser,
  createIncomeForUser,
  updateIncomeForUser,
  deleteIncomeForUser,
} from "../services/income.service";

export async function listIncomesHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const incomes = await listIncomesForUser(req.user.id);

  return res.json({
    data: incomes,
    error: null,
  });
}

export async function createIncomeHandler(req: AuthRequest, res: Response) {
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
    note,
  } = req.body as {
    categoryId?: string;
    amount?: number;
    currency?: string;
    date?: string;
    recurrencePeriod?: RecurrencePeriod;
    recurrenceStart?: string | null;
    recurrenceEnd?: string | null;
    note?: string | null;
  };

  if (!categoryId || amount === undefined || !currency || !date) {
    return res.status(400).json({
      data: null,
      error: { message: "categoryId, amount, currency and date are required" },
    });
  }

  try {
    const income = await createIncomeForUser({
      userId: req.user.id,
      categoryId,
      amount: Number(amount),
      currency,
      date: new Date(date),
      recurrencePeriod,
      recurrenceStart: recurrenceStart ? new Date(recurrenceStart) : null,
      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : null,
      note,
    });

    return res.status(201).json({
      data: income,
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
          error: { message: "Category type must be INCOME" },
        });
      }

      if (err.message === "FORBIDDEN_CATEGORY") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to use this category" },
        });
      }
    }

    console.error("[income.create]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function updateIncomeHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const incomeId = req.params.id;

  const {
    categoryId,
    amount,
    currency,
    date,
    recurrencePeriod,
    recurrenceStart,
    recurrenceEnd,
    note,
  } = req.body as {
    categoryId?: string;
    amount?: number;
    currency?: string;
    date?: string;
    recurrencePeriod?: RecurrencePeriod;
    recurrenceStart?: string | null;
    recurrenceEnd?: string | null;
    note?: string | null;
  };

  try {
    const income = await updateIncomeForUser({
      userId: req.user.id,
      incomeId,
      categoryId,
      amount: amount !== undefined ? Number(amount) : undefined,
      currency,
      date: date ? new Date(date) : undefined,
      recurrencePeriod,
      recurrenceStart: recurrenceStart ? new Date(recurrenceStart) : undefined,
      recurrenceEnd: recurrenceEnd ? new Date(recurrenceEnd) : undefined,
      note,
    });

    return res.json({
      data: income,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Income not found" },
        });
      }

      if (err.message === "FORBIDDEN") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to update this income" },
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
          error: { message: "Category type must be INCOME" },
        });
      }

      if (err.message === "FORBIDDEN_CATEGORY") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to use this category" },
        });
      }
    }

    console.error("[income.update]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function deleteIncomeHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const incomeId = req.params.id;

  try {
    await deleteIncomeForUser({
      userId: req.user.id,
      incomeId,
    });

    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Income not found" },
        });
      }

      if (err.message === "FORBIDDEN") {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to delete this income" },
        });
      }
    }

    console.error("[income.delete]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}
