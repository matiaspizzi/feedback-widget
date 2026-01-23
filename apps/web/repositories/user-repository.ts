import { db, Prisma } from "@repo/database";
import {
  UniqueConstraintError,
  PRISMA_UNIQUE_KEY_ERROR,
} from "@lib/errors";

export class UserRepository {
  async getById(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await db.user.create({
        data,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_KEY_ERROR
      ) {
        throw new UniqueConstraintError("User", "email");
      }
      throw error;
    }
  }
}
