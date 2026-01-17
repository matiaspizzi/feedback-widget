import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ApiKeyRepository } from "@repositories/apikey-repository";
import { ApiKeyService } from "@services/apikey-service";

export function withAuth<T>(
  handler: (req: Request, ctx: { userId: string; deps: T }, params: any) => Promise<NextResponse>,
  getDeps?: (userId: string) => T
) {
  return async (req: Request, { params }: any) => {
    try {
      const session = await auth();
      if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

      const deps = getDeps ? getDeps(session.user.id) : ({} as T);

      return await handler(req, { userId: session.user.id, deps }, params);
    } catch (error: any) {
      if (error.message === "API Key not found") return new NextResponse("Not Found", { status: 404 });
      if (error.message === "Unauthorized") return new NextResponse("Forbidden", { status: 403 });

      console.error("API_ERROR:", error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
}

export function withApiKey<T>(
  handler: (req: Request, ctx: { userId: string; deps: T }, params: any) => Promise<NextResponse>,
  getDeps: () => T
) {
  return async (req: Request, { params }: any) => {
    try {
      const apiKeyHeader = req.headers.get("x-api-key");
      if (!apiKeyHeader) {
        return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
      }

      const apiKeyService = new ApiKeyService(new ApiKeyRepository());
      const validation = await apiKeyService.validate(apiKeyHeader);

      if (!validation.valid || !validation.apiKey) {
        return NextResponse.json({ error: validation.error }, { status: 401 });
      }

      const userId = validation.apiKey.userId;
      const deps = getDeps();

      return await handler(req, { userId, deps }, params);
    } catch (error: any) {
      console.error("[API_KEY_WRAPPER_ERROR]:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  };
}