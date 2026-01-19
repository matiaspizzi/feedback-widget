import { NextResponse } from "next/server";
import { apiKeySchema } from "@repo/shared";
import { withAuth } from "@lib/api-utils";
import { getApiKeyDeps } from "@lib/deps";

export const POST = withAuth(async (req, { userId, deps }) => {
  try {
    const body = await req.json();
    const validation = apiKeySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payload",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const apiKey = await deps.apiKeyService.create({
      name: validation.data.name,
      userId: userId,
      expiresAt: validation.data.expiresAt ? new Date(validation.data.expiresAt) : null,
    });

    return NextResponse.json(
      {
        success: true,
        data: apiKey,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}, getApiKeyDeps);
