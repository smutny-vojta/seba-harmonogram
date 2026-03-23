import { MongoClient } from "mongodb";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const globalForDb = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

export const client =
  globalForDb.mongoClient ?? new MongoClient(process.env.DATABASE_URL!);

if (process.env.NODE_ENV !== "production") {
  globalForDb.mongoClient = client;
}

export const db = client.db(process.env.MONGO_DB_NAME!);
