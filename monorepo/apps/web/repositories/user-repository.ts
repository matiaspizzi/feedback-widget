import { db, Prisma } from "@repo/database";
import { UniqueConstraintError, DatabaseError, NotFoundError, PRISMA_UNIQUE_KEY_ERROR } from "@/lib/errors";

export class UserRepository {
  async getById(id: string) {
    try {
      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) throw new NotFoundError("User");
      return user;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError("Error fetching user by ID");
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await db.user.findUnique({
        where: { email },
      });
      return user;
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
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === PRISMA_UNIQUE_KEY_ERROR) {
        throw new UniqueConstraintError("User", "email");
      }
      console.error("[USER_REPOSITORY_CREATE_ERROR]:", error);
      throw new DatabaseError("Failed to create user account");
    }
  }
}
