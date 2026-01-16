import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared';
import { prisma } from "@repo/database"

export async function POST(req: Request) {
  try {
    const apiKeyHeader = req.headers.get("x-api-key");
    if (!apiKeyHeader) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const apiKey = await prisma.apiKey.findUnique({
      where: { value: apiKeyHeader },
    });

    if (!apiKey) {
      return NextResponse.json({ error: "Invalid API Key" }, { status: 401 });
    }

    if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
      return NextResponse.json({ error: "API Key expired" }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: "Invalid payload",
        details: result.error.format()
      }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        projectId: result.data.projectId,
        userId: result.data.userId,
        rating: result.data.rating,
        comment: result.data.comment,
        metadata: result.data.context as any,
      },
    });

    return NextResponse.json({ success: true, id: feedback.id }, { status: 201 });
  } catch (error) {
    console.error('[DATABASE_ERROR]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}