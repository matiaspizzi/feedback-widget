"use server";

import { ApiKeyService } from "@services/apikey-service";
import { ApiKeyRepository } from "@repositories/apikey-repository";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const repository = new ApiKeyRepository();
const service = new ApiKeyService(repository);

export async function createApiKeyAction(data: { name: string; expiresAt: string | null }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
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
    if (error.message === "The expiration date cannot be in the past.") {
      return { success: false, error: error.message };
    }
    console.error("[CREATE_API_KEY_FATAL]:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to create key";
    return { success: false, error: errorMessage };
  }
}

export async function deleteApiKeyAction(id: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    await service.delete(id, session.user.id);

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    if (error.message === "API Key not found") {
      return { success: false, error: error.message };
    }
    console.error("[DELETE_API_KEY_FATAL]:", error);
    return { success: false, error: "Failed to delete key" };
  }
}