import { PrismaClient } from '.prisma/client';
import { logger } from '../utils/logger';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Connect to database
prisma.$connect()
  .then(() => logger.info('Connected to PostgreSQL database'))
  .catch((error:any) => logger.error('Database connection error:', error));

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});



