import { Prisma } from "@repo/database";
import { UserRepository } from "@repositories/user-repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: Prisma.UserCreateInput) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return this.userRepository.create(data);
  }
}
