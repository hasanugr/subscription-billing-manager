import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";
import { prisma } from "../config/prisma";
import { registerUser, loginUser } from "../services/auth.service";

export async function registerHandler(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: { message: "email and password are required" },
      });
    }

    const user = await registerUser(email, password);

    return res.status(201).json({
      data: user,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "EMAIL_ALREADY_EXISTS") {
      return res.status(409).json({
        data: null,
        error: { message: "Email already registered" },
      });
    }

    console.error("[auth.register]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function loginHandler(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: { message: "email and password are required" },
      });
    }

    const { token, user } = await loginUser(email, password);

    // HttpOnly cookie
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.json({
      data: user,
      error: null,
    });
  } catch (err) {
    if (err instanceof Error && err.message === "INVALID_CREDENTIALS") {
      return res.status(401).json({
        data: null,
        error: { message: "Invalid email or password" },
      });
    }

    console.error("[auth.login]", err);
    return res.status(500).json({
      data: null,
      error: { message: "Internal Server Error" },
    });
  }
}

export async function logoutHandler(_req: AuthRequest, res: Response) {
  res.clearCookie("accessToken", { path: "/" });
  return res.json({ message: "Logged out successfully" });
}

export async function meHandler(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({
      data: null,
      error: { message: "Unauthorized" },
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      baseCurrency: true,
      createdAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      data: null,
      error: { message: "User not found" },
    });
  }

  return res.json({
    data: user,
    error: null,
  });
}
