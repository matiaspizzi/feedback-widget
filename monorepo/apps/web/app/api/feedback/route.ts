import { NextRequest, NextResponse } from "next/server";
import { toResponse } from "@lib/api-error-handler";
import { validateUserOrKey, validateSchema } from "@lib/api-utils";
import { getFeedbackDeps } from "@lib/deps";
import { feedbackSchema } from "@repo/shared";

export async function POST(req: NextRequest) {
  try {
    const userId = await validateUserOrKey(req);

    const data = await validateSchema(req, feedbackSchema);

    const deps = getFeedbackDeps();
    const feedback = await deps.feedbackService.create({ ...data, userId });

    return NextResponse.json(
      { success: true, data: feedback },
      { status: 201 },
    );
  } catch (error) {
    return toResponse(error);
  }
}
