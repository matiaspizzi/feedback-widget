import { NextResponse } from "next/server";
import { apiKeySchema } from "@repo/shared";
import { withAuth } from "@/lib/api-utils";
import { getApiKeyDeps } from "@/lib/deps";

export const GET = withAuth(async (_req, { userId, deps }) => {
  const apiKeys = await deps.apiKeyService.getAllByUserId(userId);
  return NextResponse.json(apiKeys);
}, getApiKeyDeps);

export const POST = withAuth(async (req, { userId, deps }) => {
  const body = await req.json();
  const validatedFields = apiKeySchema.safeParse(body);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues?.[0]?.message || "Invalid fields";
    return new NextResponse(errorMessage, { status: 400 });
  }

  const { name, expiresAt } = validatedFields.data;

  const apiKey = await deps.apiKeyService.create({
    name,
    userId: userId,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
  });

  return NextResponse.json(apiKey);
}, getApiKeyDeps);