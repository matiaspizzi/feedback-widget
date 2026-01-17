import { Prisma } from "@repo/database";
import { UserRepository } from "@repositories/user-repository";

export class UserService {
  private repository: UserRepository;

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
      throw new Error("User with this email already exists");
    }

    return this.repository.create(data);
  }
}
