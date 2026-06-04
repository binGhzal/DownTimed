import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "./generated/client/client";

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super("DATABASE_URL is required for Downtimed database operations.");
    this.name = "DatabaseNotConfiguredError";
  }
}

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseNotConfiguredError();
  prisma ??= new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
  return prisma;
}
