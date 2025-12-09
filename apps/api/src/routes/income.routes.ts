import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  listIncomesHandler,
  createIncomeHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
} from "../controllers/income.controller";

export const incomeRouter = Router();

incomeRouter.get("/", authMiddleware, listIncomesHandler);
incomeRouter.post("/", authMiddleware, createIncomeHandler);
incomeRouter.put("/:id", authMiddleware, updateIncomeHandler);
incomeRouter.delete("/:id", authMiddleware, deleteIncomeHandler);
