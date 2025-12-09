import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  listCategoriesHandler,
  createCategoryHandler,
  updateCategoryHandler,
  deleteCategoryHandler,
} from "../controllers/category.controller";

export const categoryRouter = Router();

categoryRouter.get("/", authMiddleware, listCategoriesHandler);
categoryRouter.post("/", authMiddleware, createCategoryHandler);
categoryRouter.put("/:id", authMiddleware, updateCategoryHandler);
categoryRouter.delete("/:id", authMiddleware, deleteCategoryHandler);
