import { Router } from "express";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

// /api/health
apiRouter.use("/health", healthRouter);
