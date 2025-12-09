import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";
import { categoryRouter } from "./category.routes";
import { expenseRouter } from "./expense.routes";
import { incomeRouter } from "./income.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/expenses", expenseRouter);
apiRouter.use("/incomes", incomeRouter);
