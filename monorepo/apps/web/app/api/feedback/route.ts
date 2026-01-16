import { NextResponse } from 'next/server';
import { feedbackSchema } from '@repo/shared';
import { ApiKeyService } from '@/services/apikey-service';
import { FeedbackService } from '@/services/feedback-service';

export async function POST(req: Request) {
  try {
    const apiKeyHeader = req.headers.get("x-api-key");
    if (!apiKeyHeader) {
      return NextResponse.json({ error: "Missing API Key" }, { status: 401 });
    }

    const apiKeyService = new ApiKeyService();
    const validationResult = await apiKeyService.validateApiKey(apiKeyHeader);

    if (!validationResult.valid) {
      return NextResponse.json({ error: validationResult.error }, { status: 401 });
    }

    const body = await req.json();
    const result = feedbackSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({
        error: "Invalid payload",
        details: result.error.format()
      }, { status: 400 });
    }

    const feedbackService = new FeedbackService();
    const feedback = await feedbackService.createFeedback({
      projectId: result.data.projectId,
      userId: result.data.userId,
      rating: result.data.rating,
      comment: result.data.comment,
      metadata: result.data.context,
    });

    return NextResponse.json({ success: true, id: feedback.id }, { status: 201 });
  } catch (error) {
    console.error('[FEEDBACK_POST_ERROR]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}