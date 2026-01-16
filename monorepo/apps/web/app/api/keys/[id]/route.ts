import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { ApiKeyService } from "@/services/apikey-service";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return new NextResponse("API Key ID is required", { status: 400 });
    }

    const apiKeyService = new ApiKeyService();
    await apiKeyService.deleteApiKey(id, session.user.id);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.message === "API Key not found") {
      return new NextResponse("Not Found", { status: 404 });
    }
    if (error.message === "Unauthorized") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    console.error("[API_KEY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
