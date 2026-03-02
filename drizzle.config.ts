import { defineConfig } from "drizzle-kit";
import 'dotenv/config';

const dbPath = process.env.DATABASE_URL;

if (!dbPath) {
  throw new Error("DATABASE_URL is not defined");
}

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
  casing: "snake_case",
});
