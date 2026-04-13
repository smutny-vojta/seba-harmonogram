import { MongoClient } from "mongodb";
import { runtimeConfig } from "@/config";

const globalForDb = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

export const client =
  globalForDb.mongoClient ?? new MongoClient(runtimeConfig.databaseUrl);

if (runtimeConfig.nodeEnv !== "production") {
  globalForDb.mongoClient = client;
}

export const db = client.db(runtimeConfig.mongoDbName);
