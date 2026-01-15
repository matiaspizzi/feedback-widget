import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared'; 
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.FEEDBACK_API_KEY}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 });
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}