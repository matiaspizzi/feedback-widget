import { db, Prisma } from "@repo/database";
import {
  NotFoundError,
  PRISMA_NOT_FOUND_ERROR,
} from "@lib/errors";

export class FeedbackRepository {
  async getById(id: string) {
    return db.feedback.findUnique({
      where: { id },
    });
  }

  async getWithFilters(filter: Prisma.FeedbackWhereInput) {
    return db.feedback.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });
  }

  async create(data: Prisma.FeedbackCreateInput) {
    return db.feedback.create({
      data,
    });
  }

  async deleteById(id: string) {
    try {
      return await db.feedback.delete({
        where: { id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_NOT_FOUND_ERROR
      ) {
        throw new NotFoundError("Feedback");
      }
      throw error;
    }
  }
}
