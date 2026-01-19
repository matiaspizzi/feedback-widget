import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared';
import { withApiKey } from '@lib/api-utils';
import { getFeedbackDeps } from '@lib/deps';

export const POST = withApiKey(async (req, { deps }) => {
  try {
    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: "Validation Failed",
        details: result.error.flatten()
      }, { status: 400 });
    }

    const feedback = await deps.feedbackService.create(result.data);

    return NextResponse.json({
      success: true,
      data: feedback
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Internal Server Error"
    }, { status: 500 });
  }
}, getFeedbackDeps);