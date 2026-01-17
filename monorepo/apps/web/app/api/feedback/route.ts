import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared';
import { withApiKey } from '@lib/api-utils';
import { getFeedbackDeps } from '@lib/deps';

export const POST = withApiKey(async (req, { deps }) => {
  const body = await req.json();
  const result = feedbackSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({
      error: "Invalid payload",
      details: result.error.format()
    }, { status: 400 });
  }

  const feedback = await deps.feedbackService.create({
    projectId: result.data.projectId,
    userId: result.data.userId,
    rating: result.data.rating,
    comment: result.data.comment,
    metadata: result.data.context,
  });

  return NextResponse.json({
    success: true,
    id: feedback.id
  }, { status: 201 });

}, getFeedbackDeps);