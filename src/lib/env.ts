import { z } from "zod/v4";
import "dotenv/config";

// !TODO: upravit db url na mongo

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),
  CRON_SECRET: z.string().min(1).optional(),
});

export const env = envSchema.parse(process.env);
