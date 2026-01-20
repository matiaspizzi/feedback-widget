import { NextRequest, NextResponse } from "next/server";
import { validateUserOrKey } from "@lib/api-utils";
import { toResponse } from "@lib/api-error-handler";
import { getApiKeyDeps } from "@lib/deps";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = await validateUserOrKey(req);
    const { id } = params;
    const deps = getApiKeyDeps();
    await deps.apiKeyService.delete(id, userId);

    return new NextResponse(null, { status: 204 });
  } catch (error: unknown) {
    return toResponse(error);
  }
}
