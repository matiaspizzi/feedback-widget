"use server";

import { ApiKeyService } from "@services";
import { ApiKeyRepository } from "@repositories";
import { auth } from "@auth";
import { revalidatePath } from "next/cache";
import { isDomainError, UnauthorizedError } from "@lib/errors";

const repository = new ApiKeyRepository();
const service = new ApiKeyService(repository);

export async function createApiKeyAction(data: { name: string; expiresAt: string | null }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    const result = await service.create({
      name: data.name,
      userId: session.user.id,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      data: { value: result.value }
    };
  } catch (error: any) {
    if (isDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create key" };
  }
}

export async function deleteApiKeyAction(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      throw new UnauthorizedError();
    }

    await service.delete(id, session.user.id);

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    if (isDomainError(error)) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to delete key" };
  }
}