import { NextResponse } from "next/server";
import { withAuth } from "@lib/api-utils";
import { getApiKeyDeps } from "@lib/deps";

export const DELETE = withAuth(async (_req, { userId, deps }, { params }) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    await deps.apiKeyService.delete(id, userId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Deletion failed" }, { status: 500 });
  }
}, getApiKeyDeps);