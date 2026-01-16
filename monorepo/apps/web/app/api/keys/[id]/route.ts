import { auth } from "@/auth";
import { prisma } from "@repo/database";
import { NextResponse } from "next/server";

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

    const apiKey = await prisma.apiKey.findUnique({
      where: {
        id,
      },
    });

    if (!apiKey) {
      return new NextResponse("Not Found", { status: 404 });
    }

    if (apiKey.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.apiKey.delete({
      where: {
        id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[API_KEY_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
