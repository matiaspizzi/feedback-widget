import { db, Prisma } from "@repo/database";

export class UserRepository {
  async findById(id: string) {
    return db.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return db.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return db.user.create({
      data,
    });
  }
}
