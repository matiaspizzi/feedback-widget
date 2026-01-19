import { NextRequest, NextResponse } from "next/server";
import { toResponse } from "@lib/api-error-handler";
import { validateUserOrKey } from "@lib/api-utils";
import { validateFeedbackBody } from "@lib/validations/feedback";
import { getFeedbackDeps } from "@lib/deps";

export async function POST(req: NextRequest) {
  try {
    const userId = await validateUserOrKey(req);

    const data = await validateFeedbackBody(req);

    const deps = getFeedbackDeps();
    const feedback = await deps.feedbackService.create({ ...data, userId });

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    return toResponse(error);
  }
}