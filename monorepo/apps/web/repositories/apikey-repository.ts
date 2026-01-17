import { db, Prisma } from "@repo/database";
import { UniqueConstraintError, DatabaseError, NotFoundError, PRISMA_NOT_FOUND_ERROR } from "../lib/errors";

export class ApiKeyRepository {
  async getById(id: string) {
    try {
      const apiKey = await db.apiKey.findUnique({
        where: { id },
      });

      if (!apiKey) throw new NotFoundError("API Key");
      return apiKey;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error retrieving API Key");
    }
  }

  async getByValue(value: string) {
    try {
      const apiKey = await db.apiKey.findUnique({
        where: { value },
      });

      if (!apiKey) throw new NotFoundError("API Key");
      return apiKey;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error retrieving API Key");
    }
  }

  async getWithFilters(filter: Prisma.ApiKeyWhereInput, orderBy?: Prisma.ApiKeyOrderByWithRelationInput) {
    try {
      return await db.apiKey.findMany({
        where: filter,
        orderBy: orderBy || { createdAt: "desc" },
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving API Keys");
    }
  }

  async getAllByUserId(userId: string) {
    try {
      return await this.getWithFilters({ userId });
    } catch (error) {
      throw new DatabaseError("Error retrieving API Keys");
    }
  }

  async create(data: any) {
    try {
      return await db.apiKey.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UniqueConstraintError("API Key", "name");
        }
      }
      throw new DatabaseError("Error creating API Key");
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
