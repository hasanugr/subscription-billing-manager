import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

import { prisma } from "../config/prisma";
import { env } from "../config/env";

type JwtPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

export async function registerUser(email: string, password: string) {
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
      baseCurrency: true,
      createdAt: true,
    },
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  // JWT payload
  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

  // Return user data without passwordHash
  const safeUser = {
    id: user.id,
    email: user.email,
    role: user.role,
    baseCurrency: user.baseCurrency,
    createdAt: user.createdAt,
  };

  return { token, user: safeUser };
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  return decoded;
}
