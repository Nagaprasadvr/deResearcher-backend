import { PrismaClient } from "@prisma/client";
import { env } from "bun";

// Define a global variable to hold the Prisma client instance
const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a function to initialize the Prisma client
const createPrismaClient = () => {
  return new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// Check if the global variable already has a Prisma client instance
// If not, create a new instance and assign it to the global variable
globalForPrisma.prisma = globalForPrisma.prisma ?? createPrismaClient();

// Export the Prisma client instance
export const db = globalForPrisma.prisma;
