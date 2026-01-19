import { NextRequest, NextResponse } from "next/server";
import { apiKeySchema } from "@repo/shared";
import { validateUserOrKey, parseJson } from "@lib/api-utils";
import { toResponse } from "@lib/api-error-handler";
import { getApiKeyDeps } from "@lib/deps";
import { BadRequestError } from "@lib/errors";

export async function POST(req: NextRequest) {
  try {
    const userId = await validateUserOrKey(req);

    const body = await parseJson(req);
    const validation = apiKeySchema.safeParse(body);

    if (!validation.success) {
      throw new BadRequestError("Invalid payload", validation.error.flatten().fieldErrors);
    }

    const deps = getApiKeyDeps();
    const apiKey = await deps.apiKeyService.create({
      name: validation.data.name,
      userId: userId,
      expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : null,
    });

    return NextResponse.json({ success: true, data: apiKey }, { status: 201 });
  } catch (error) {
    return toResponse(error);
  }
}