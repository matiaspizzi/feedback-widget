import { randomBytes } from "crypto";
import { ApiKeyRepository } from "@repositories";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError
} from "@lib/errors";

export class ApiKeyService {
  private readonly repository: ApiKeyRepository;

  constructor(repository: ApiKeyRepository) {
    this.repository = repository;
  }

  async getById(id: string) {
    const apiKey = await this.repository.getById(id);
    if (!apiKey) throw new NotFoundError("API Key");
    return apiKey;
  }

  async getByValue(value: string) {
    return this.repository.getByValue(value);
  }

  async getAllByUserId(userId: string) {
    return this.repository.getAllByUserId(userId);
  }

  async validate(apiKeyValue: string) {
    const apiKey = await this.repository.getByValue(apiKeyValue);

    if (!apiKey) {
      return { valid: false, error: "Invalid API Key" };
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return { valid: false, error: "API Key expired" };
    }

    return { valid: true, apiKey };
  }

  async create(data: { name: string; userId: string; expiresAt?: Date | null }) {
    if (data.expiresAt && data.expiresAt < new Date()) {
      throw new BadRequestError("The expiration date cannot be in the past.");
    }

    const keyValue = `fk_${randomBytes(24).toString("hex")}`;

    return this.repository.create({
      name: data.name,
      value: keyValue,
      user: {
        connect: { id: data.userId },
      },
      expiresAt: data.expiresAt || null,
    });
  }

  async delete(id: string, userId: string) {
    const apiKey = await this.repository.getById(id);

    if (!apiKey) {
      throw new NotFoundError("API Key");
    }

    if (apiKey.userId !== userId) {
      throw new UnauthorizedError("You do not have permission to delete this key");
    }

    return this.repository.deleteById(id);
  }
}
