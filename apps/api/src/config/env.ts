export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "15m",
};

if (!env.JWT_SECRET) {
  console.warn(
    "[env] JWT_SECRET is not set. Using an empty string is unsafe in production."
  );
}

if (!env.DATABASE_URL) {
  console.warn(
    "[env] DATABASE_URL is not set. Prisma uses prisma.config.ts for this, but .env should also have it."
  );
}
