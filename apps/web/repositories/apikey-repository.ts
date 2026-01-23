import { db, Prisma } from "@repo/database";
import {
  UniqueConstraintError,
  NotFoundError,
  PRISMA_NOT_FOUND_ERROR,
  PRISMA_UNIQUE_KEY_ERROR,
} from "@lib/errors";

export class ApiKeyRepository {
  async getById(id: string) {
    return db.apiKey.findUnique({
      where: { id },
    });
  }

  async getByValue(value: string) {
    return db.apiKey.findUnique({
      where: { value },
    });
  }

  async getWithFilters(
    filter: Prisma.ApiKeyWhereInput,
    orderBy?: Prisma.ApiKeyOrderByWithRelationInput,
  ) {
    return db.apiKey.findMany({
      where: filter,
      orderBy: orderBy || { createdAt: "desc" },
    });
  }

  async getAllByUserId(userId: string) {
    return this.getWithFilters({ userId });
  }

  async create(data: Prisma.ApiKeyCreateInput) {
    try {
      return await db.apiKey.create({ data });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_KEY_ERROR
      ) {
        throw new UniqueConstraintError("API Key", "name");
      }
      throw error;
    }
  }

  async deleteById(id: string) {
    try {
      return await db.apiKey.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_ERROR
      ) {
        throw new NotFoundError("API Key");
      }
      throw error;
    }
  }
}
