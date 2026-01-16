import { randomBytes } from "crypto";
import { ApiKeyRepository } from "@repositories/apikey-repository";

export class ApiKeyService {
  private apiKeyRepository: ApiKeyRepository;

  constructor() {
    this.apiKeyRepository = new ApiKeyRepository();
  }

  async getApiKeyById(id: string) {
    return this.apiKeyRepository.getById(id);
  }

  async getApiKeyByValue(value: string) {
    return this.apiKeyRepository.getByValue(value);
  }

  async getAllApiKeysByUserId(userId: string) {
    return this.apiKeyRepository.getAllByUserId(userId);
  }

  async validateApiKey(apiKeyValue: string) {
    const apiKey = await this.apiKeyRepository.getByValue(apiKeyValue);

    if (!apiKey) {
      return { valid: false, error: "Invalid API Key" };
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return { valid: false, error: "API Key expired" };
    }

    return { valid: true, apiKey };
  }

  async createApiKey(data: { name: string; userId: string; expiresAt?: Date | null }) {
    const keyValue = `fk_${randomBytes(24).toString("hex")}`;

    return this.apiKeyRepository.create({
      name: data.name,
      value: keyValue,
      user: {
        connect: { id: data.userId },
      },
      expiresAt: data.expiresAt || null,
    });
  }

  async deleteApiKey(id: string, userId: string) {
    const apiKey = await this.apiKeyRepository.getById(id);

    if (!apiKey) {
      throw new Error("API Key not found");
    }

    if (apiKey.userId !== userId) {
      throw new Error("Unauthorized");
    }

    return this.apiKeyRepository.deleteById(id);
  }
}
