import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  // Use the Prisma Client from the global context in production
  prisma = new PrismaClient();
} else {
  // Create a new Prisma Client instance for development
  prisma = new PrismaClient();
}

export default prisma;