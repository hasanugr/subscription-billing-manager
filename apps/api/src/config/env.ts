export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  DATABASE_URL: process.env.DATABASE_URL ?? "",
};

if (!env.DATABASE_URL) {
  console.warn(
    "[env] DATABASE_URL is not set. Prisma uses prisma.config.ts for this, but .env should also have it."
  );
}
