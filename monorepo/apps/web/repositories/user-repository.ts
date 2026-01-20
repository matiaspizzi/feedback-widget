import { db, Prisma } from "@repo/database";
import {
  UniqueConstraintError,
  DatabaseError,
  PRISMA_UNIQUE_KEY_ERROR,
} from "@lib/errors";

export class UserRepository {
  async getById(id: string) {
    try {
      return await db.user.findUnique({
        where: { id },
      });
    } catch (error) {
      throw new DatabaseError("Error fetching user by ID");
    }
  }

  async getByEmail(email: string) {
    try {
      return await db.user.findUnique({
        where: { email },
      });
    } catch (error) {
      throw new DatabaseError("Error fetching user by email");
    }
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
      throw new DatabaseError("Failed to create user account record");
    }
  }
}
