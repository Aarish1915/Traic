import { PrismaClient } from '@prisma/client';
import { logger } from '../../common/logger';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

export async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info('Database: Successfully connected to PostgreSQL via Prisma.');
  } catch (err) {
    logger.error({ err }, 'Prisma PostgreSQL connection failed.');
    process.exit(1);
  }
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
  logger.info('Database: Prisma connection closed.');
}
