import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  listExpensesHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
} from "../controllers/expense.controller";

export const expenseRouter = Router();

expenseRouter.get("/", authMiddleware, listExpensesHandler);
expenseRouter.post("/", authMiddleware, createExpenseHandler);
expenseRouter.put("/:id", authMiddleware, updateExpenseHandler);
expenseRouter.delete("/:id", authMiddleware, deleteExpenseHandler);
