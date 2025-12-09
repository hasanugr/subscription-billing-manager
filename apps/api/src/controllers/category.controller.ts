import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import {
  listCategoriesForUser,
  createCategoryForUser,
  updateCategoryForUser,
  deleteCategoryForUser,
  type CategoryType,
} from "../services/category.service";

export async function listCategoriesHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const categories = await listCategoriesForUser(req.user.id);

  return res.json({
    data: categories,
    error: null,
  });
}

export async function createCategoryHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const { name, type, isGlobal } = req.body as {
    name?: string;
    type?: CategoryType;
    isGlobal?: boolean;
  };

  if (!name || !type) {
    return res.status(400).json({
      data: null,
      error: { message: "name and type are required" },
    });
  }

  try {
    const category = await createCategoryForUser({
      userId: req.user.id,
      name,
      type,
      isGlobal: isGlobal ?? false,
    });

    return res.status(201).json({
      data: category,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_NAME") {
      return res.status(400).json({
        data: null,
        error: { message: "Invalid category name" },
      });
    }

    console.error("[category.create]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function updateCategoryHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const categoryId = req.params.id;
  const { name, type } = req.body as {
    name?: string;
    type?: CategoryType;
  };

  try {
    const category = await updateCategoryForUser({
      userId: req.user.id,
      categoryId,
      name,
      type,
    });

    return res.json({
      data: category,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Category not found" },
        });
      }

      if (
        err.message === "FORBIDDEN" ||
        err.message === "FORBIDDEN_GLOBAL_CATEGORY"
      ) {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to update this category" },
        });
      }
    }

    console.error("[category.update]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function deleteCategoryHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res
      .status(401)
      .json({ data: null, error: { message: "Unauthorized" } });
  }

  const categoryId = req.params.id;

  try {
    await deleteCategoryForUser({
      userId: req.user.id,
      categoryId,
    });

    return res.status(204).send();
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return res.status(404).json({
          data: null,
          error: { message: "Category not found" },
        });
      }

      if (
        err.message === "FORBIDDEN" ||
        err.message === "FORBIDDEN_GLOBAL_CATEGORY"
      ) {
        return res.status(403).json({
          data: null,
          error: { message: "Not allowed to delete this category" },
        });
      }

      if (err.message === "HAS_LINKED_RECORDS") {
        return res.status(400).json({
          data: null,
          error: { message: "Category has linked expenses or incomes" },
        });
      }
    }

    console.error("[category.delete]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}
