import { db, Prisma } from "@repo/database";

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

  async getWithFilters(filter: Prisma.ApiKeyWhereInput, orderBy?: Prisma.ApiKeyOrderByWithRelationInput) {
    return db.apiKey.findMany({
      where: filter,
      orderBy: orderBy || { createdAt: "desc" },
    });
  }

  async getAllByUserId(userId: string) {
    return this.getWithFilters({ userId });
  }

  async create(data: Prisma.ApiKeyCreateInput) {
    return db.apiKey.create({
      data,
    });
  }

  async deleteById(id: string) {
    return db.apiKey.delete({
      where: { id },
    });
  }
}
