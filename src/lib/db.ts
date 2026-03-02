import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import 'dotenv/config';
import { schema } from '@/schema';

const dbPath = process.env.DATABASE_URL;

if (!dbPath) {
    throw new Error("DATABASE_URL is not defined");
}

// In development, Next.js clears the module cache often causing multiple active connections.
// Storing the connection in the global scope avoids locking issues.
const globalForDb = globalThis as unknown as {
  sqlite: Database.Database | undefined;
};

export const sqlite = globalForDb.sqlite ?? new Database(dbPath);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.sqlite = sqlite;
}

// Enable Write-Ahead Logging (WAL) mode for better concurrency and performance
// and set synchronous to NORMAL for better performance
sqlite.pragma('journal_mode = WAL');
sqlite.pragma("synchronous = NORMAL");

export const db = drizzle(sqlite, { schema: schema, casing: "snake_case" });
