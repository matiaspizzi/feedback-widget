import { auth } from "@/auth";
import { apiKeySchema } from "@repo/shared";
import { NextResponse } from "next/server";
import { UserService } from "@/services/user-service";
import { ApiKeyService } from "@/services/apikey-service";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("No autorizado: Sin sesión", { status: 401 });
    }

    const userService = new UserService();
    const user = await userService.getUserById(session.user.id);

    if (!user) {
      return new NextResponse("Usuario no encontrado en la base de datos", { status: 404 });
    }

    const body = await req.json();
    const validatedFields = apiKeySchema.safeParse(body);

    if (!validatedFields.success) {
      const errorMessage = validatedFields.error.issues?.[0]?.message || "Invalid fields";
      return new NextResponse(errorMessage, { status: 400 });
    }

    const { name, expiresAt } = validatedFields.data;

    const apiKeyService = new ApiKeyService();
    const apiKey = await apiKeyService.createApiKey({
      name,
      userId: user.id,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    return NextResponse.json(apiKey);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return new NextResponse("An API key with this name already exists", { status: 409 });
    }
    console.error("[API_KEYS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiKeyService = new ApiKeyService();
    const apiKeys = await apiKeyService.getAllApiKeysByUserId(session.user.id);

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("[API_KEYS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}