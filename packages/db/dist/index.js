import { PrismaClient } from './generated/client';
export const prisma = global.prisma ||
    new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma;
}
