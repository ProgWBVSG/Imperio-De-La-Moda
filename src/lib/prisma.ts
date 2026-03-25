import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let dbUrl = process.env.DATABASE_URL;
if (!dbUrl || dbUrl.includes("aws-0-sa-east-1.pooler")) {
  dbUrl = "postgresql://postgres:ElGranTumi123456789@db.guppnkrbifvmgrvzejyp.supabase.co:6543/postgres?pgbouncer=true";
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
