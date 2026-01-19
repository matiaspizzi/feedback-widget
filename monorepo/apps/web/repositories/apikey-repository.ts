import { db, Prisma } from "@repo/database";
import {
  UniqueConstraintError,
  DatabaseError,
  NotFoundError,
  PRISMA_NOT_FOUND_ERROR,
  PRISMA_UNIQUE_KEY_ERROR
} from "@lib/errors";

export class ApiKeyRepository {
  async getById(id: string) {
    try {
      return await db.apiKey.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving API Key by ID");
    }
  }

  async getByValue(value: string) {
    try {
      return await db.apiKey.findUnique({
        where: { value },
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving API Key by value");
    }
  }

  async getWithFilters(filter: Prisma.ApiKeyWhereInput, orderBy?: Prisma.ApiKeyOrderByWithRelationInput) {
    try {
      return await db.apiKey.findMany({
        where: filter,
        orderBy: orderBy || { createdAt: "desc" },
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving API Keys with filters");
    }
  }

  async getAllByUserId(userId: string) {
    return this.getWithFilters({ userId });
  }

  async create(data: Prisma.ApiKeyCreateInput) {
    try {
      return await db.apiKey.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PRISMA_UNIQUE_KEY_ERROR) {
        throw new UniqueConstraintError("API Key", "name");
      }
      throw new DatabaseError("Error creating API Key record");
    }
  }

  async deleteById(id: string) {
    try {
      return await db.apiKey.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PRISMA_NOT_FOUND_ERROR) {
        throw new NotFoundError("API Key");
      }
      throw new DatabaseError("Failed to delete API Key record");
    }
  }
}
