import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { schema } from "@/schema";
import { env } from "./env";

// !TODO: predelat na pripojeni k mongodb

const dbPath = env.DATABASE_URL;

// In development, Next.js clears the module cache often causing multiple active connections.
// Storing the connection in the global scope avoids locking issues.
const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

export const sqlite = globalForDb.sqlite ?? new Database(dbPath);

if (process.env.NODE_ENV !== "production") {
  globalForDb.sqlite = sqlite;
}

// Enable Write-Ahead Logging (WAL) mode for better concurrency and performance
// and set synchronous to NORMAL for better performance
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("synchronous = NORMAL");

export const db = drizzle(sqlite, { schema: schema, casing: "snake_case" });
