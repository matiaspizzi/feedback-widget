import { auth } from "@auth";
import { UnauthorizedError } from "./errors";
import { NextRequest } from "next/server";
import { ApiKeyService } from "@services";
import { ApiKeyRepository } from "@repositories";

export type SafeRequest = NextRequest & { parsedBody?: unknown };

export async function validateUserOrKey(req: Request): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  const apiKey = req.headers.get("x-api-key");
  if (apiKey) {
    const service = new ApiKeyService(new ApiKeyRepository());
    const validation = await service.validate(apiKey);

    if (validation.valid && validation.apiKey) {
      return validation.apiKey.userId;
    }

    throw new UnauthorizedError(validation.error || "Invalid API Key");
  }

  throw new UnauthorizedError("Authentication required: Session or API Key");
}

export async function parseJson(req: NextRequest): Promise<unknown> {
  const contentType = req.headers.get("content-type");
  if (!contentType?.includes("application/json")) return undefined;
  return await req.json();
}