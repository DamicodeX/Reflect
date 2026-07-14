import { PrismaClient } from "./generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();


// globalThis.prisma  is to ensure that the Prisma client instance 
 // is shared across the entire application, preventing multiple instances from being created.