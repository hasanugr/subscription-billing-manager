import { Router } from "express";
import { healthRouter } from "./health.routes";
import { authRouter } from "./auth.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
