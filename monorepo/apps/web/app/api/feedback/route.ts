import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: 'Invalid payload',
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