import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not defined`);
  }

  return value;
}

function getOptionalEnv(name: string): string | undefined {
  const value = process.env[name];

  if (!value) {
    return undefined;
  }

  return value;
}

export const runtimeConfig = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  databaseUrl: getRequiredEnv("DATABASE_URL"),
  mongoDbName: getRequiredEnv("MONGO_DB_NAME"),
  cronSecret: getOptionalEnv("CRON_SECRET"),
} as const;
