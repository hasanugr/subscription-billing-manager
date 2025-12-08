import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service";

export type AuthRequest = Request & {
  user?: {
    id: string;
    role: "USER" | "ADMIN";
  };
};

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        data: null,
        error: { message: "Unauthorized" },
      });
    }

    const payload = verifyToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({
      data: null,
      error: { message: "Invalid or expired token" },
    });
  }
}
