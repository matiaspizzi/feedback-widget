import { db, Prisma } from "@repo/database";
import { NotFoundError, DatabaseError, PRISMA_NOT_FOUND_ERROR } from "@/lib/errors";

export class FeedbackRepository {
  async getById(id: string) {
    try {
      const feedback = await db.feedback.findUnique({
        where: { id },
      });

      if (!feedback) throw new NotFoundError("Feedback");
      return feedback;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error retrieving feedback");
    }
  }

  async getWithFilters(filter: Prisma.FeedbackWhereInput) {
    try {
      return await db.feedback.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      throw new DatabaseError("Error retrieving filtered feedback");
    }
  }

  async create(data: Prisma.FeedbackCreateInput) {
    try {
      return await db.feedback.create({
        data,
      });
    } catch (error) {
      throw new DatabaseError("Failed to submit feedback");
    }
  }

  async deleteById(id: string) {
    try {
      return await db.feedback.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PRISMA_NOT_FOUND_ERROR) {
        throw new NotFoundError("Feedback");
      }
      throw new DatabaseError("Failed to delete feedback record");
    }
  }
}
