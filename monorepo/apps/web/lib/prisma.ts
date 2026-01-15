import { prisma as databaseClient, type PrismaClient } from "@repo/database";

export const prisma: PrismaClient = databaseClient;