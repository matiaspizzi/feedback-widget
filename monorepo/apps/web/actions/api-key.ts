"use server";

import { ApiKeyService } from "@services";
import { ApiKeyRepository } from "@repositories";
import { auth } from "@auth";
import { revalidatePath } from "next/cache";
import { isDomainError, UnauthorizedError } from "@lib/errors";
import { apiKeySchema } from "@repo/shared";
import { ActionResponse } from "./types";

const repository = new ApiKeyRepository();
const service = new ApiKeyService(repository);

interface CreateKeyData {
  value: string;
}

export async function createApiKeyAction(rawData: unknown): Promise<ActionResponse<CreateKeyData>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new UnauthorizedError("Session not found");
    }

    const validation = apiKeySchema.safeParse(rawData);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data"
      };
    }

    const result = await service.create({
      name: validation.data.name,
      userId: session.user.id,
      expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : null,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { value: result.value }
    };

  } catch (error: unknown) {
    if (isDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteApiKeyAction(id: string): Promise<ActionResponse<void>> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    await service.delete(id, session.user.id);

    revalidatePath("/dashboard");

    return { success: true, data: undefined };
  } catch (error: unknown) {
    if (isDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete key" };
  }
}