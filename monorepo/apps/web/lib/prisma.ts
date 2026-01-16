import { prisma as db, type PrismaClient } from "@repo/database";

export const prisma: PrismaClient = db;

export type { PrismaClient };