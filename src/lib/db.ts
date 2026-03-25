import { loadEnvConfig } from "@next/env";
import { MongoClient } from "mongodb";

loadEnvConfig(process.cwd());

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

if (!process.env.MONGO_DB_NAME) {
  throw new Error("MONGO_DB_NAME is not defined");
}

const globalForDb = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

export const client =
  globalForDb.mongoClient ?? new MongoClient(process.env.DATABASE_URL);

if (process.env.NODE_ENV !== "production") {
  globalForDb.mongoClient = client;
}

export const db = client.db(process.env.MONGO_DB_NAME);
