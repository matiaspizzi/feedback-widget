import { auth } from "@/auth";
import { prisma } from "@repo/database";
import { apiKeySchema } from "@repo/shared";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("No autorizado: Sin sesión", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado en la base de datos", { status: 404 });
    }

    const body = await req.json();
    const validatedFields = apiKeySchema.safeParse(body);

    if (!validatedFields.success) {
      return new NextResponse("Datos inválidos", { status: 400 });
    }

    const { name, expiresAt } = validatedFields.data;

    const keyValue = `fk_${randomBytes(24).toString("hex")}`;

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        value: keyValue,
        userId: user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(apiKey);
  } catch (error) {
    console.error("[API_KEYS_POST]", error);
    return new NextResponse("Error Interno del Servidor", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(apiKeys);
  } catch (error) {
    console.error("[API_KEYS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}