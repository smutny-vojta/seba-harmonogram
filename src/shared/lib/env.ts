import { z } from "zod/v4";
import "dotenv/config";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const env = envSchema.parse(process.env);
