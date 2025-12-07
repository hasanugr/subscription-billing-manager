import type { Request, Response, NextFunction } from "express";

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);

  res.status(500).json({
    data: null,
    error: {
      message: "Internal Server Error",
    },
  });
}
