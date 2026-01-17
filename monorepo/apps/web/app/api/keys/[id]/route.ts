import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
import { getApiKeyDeps } from "@/lib/deps";

export const DELETE = withAuth(async (_req, { userId, deps }, { params }) => {
  const { id } = params;

  if (!id) {
    return new NextResponse("API Key ID is required", { status: 400 });
  }

  await deps.apiKeyService.delete(id, userId);

  return new NextResponse(null, { status: 204 });
}, getApiKeyDeps);