import { NextRequest, NextResponse } from "next/server";
import { apiKeySchema } from "@repo/shared";
import { validateUserOrKey, validateSchema } from "@lib/api-utils";
import { toResponse } from "@lib/api-error-handler";
import { getApiKeyDeps } from "@lib/deps";

export async function POST(req: NextRequest) {
  try {
    const userId = await validateUserOrKey(req);

    const data = await validateSchema(req, apiKeySchema);

    const deps = getApiKeyDeps();
    const apiKey = await deps.apiKeyService.create({
      name: data.name,
      userId: userId,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    });

    return NextResponse.json({ success: true, data: apiKey }, { status: 201 });
  } catch (error) {
    return toResponse(error);
  }
}
