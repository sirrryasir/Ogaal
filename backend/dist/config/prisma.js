import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
const globalForPrisma = globalThis;
const pool = globalForPrisma.pool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20, // Maximum number of connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.pool = pool;
const adapter = new PrismaPg(pool);
export const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = prisma;
//# sourceMappingURL=prisma.js.map