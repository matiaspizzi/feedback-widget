import { db, Prisma } from "@repo/database";

export class FeedbackRepository {
  async getById(id: string) {
    return db.feedback.findUnique({
      where: { id },
    });
  }

  async getWithFilters(filter: Prisma.FeedbackWhereInput) {
    return db.feedback.findMany({
      where: filter,
    });
  }

  async create(data: Prisma.FeedbackCreateInput) {
    return db.feedback.create({
      data,
    });
  }

  async deleteById(id: string) {
    return db.feedback.delete({
      where: { id },
    });
  }
}
