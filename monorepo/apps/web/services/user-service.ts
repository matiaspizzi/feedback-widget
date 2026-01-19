import { Prisma } from "@repo/database";
import { UserRepository } from "@repositories";
import { UniqueConstraintError } from "@lib/errors";

export class UserService {
  private readonly repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async getByEmail(email: string) {
    return this.repository.getByEmail(email);
  }

  async create(data: Prisma.UserCreateInput) {
    const existingUser = await this.repository.getByEmail(data.email);

    if (existingUser) {
      throw new UniqueConstraintError("User", "email");
    }

    return this.repository.create(data);
  }
}
