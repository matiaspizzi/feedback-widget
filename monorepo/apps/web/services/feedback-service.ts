import { Prisma } from "@repo/database";
import { FeedbackRepository } from "@repositories/feedback-repository";

export class FeedbackService {
  private feedbackRepository: FeedbackRepository;

  constructor() {
    this.feedbackRepository = new FeedbackRepository();
  }

  async getFeedbackById(id: string) {
    return this.feedbackRepository.getById(id);
  }

  async getFeedbacksByProjectId(projectId: string) {
    return this.feedbackRepository.getWithFilters({ projectId });
  }

  async createFeedback(data: {
    projectId: string;
    userId?: string | null;
    rating: number;
    comment?: string | null;
    metadata?: any;
  }) {
    return this.feedbackRepository.create({
      projectId: data.projectId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      metadata: data.metadata || Prisma.JsonNull,
    });
  }

  async deleteFeedback(id: string) {
    return this.feedbackRepository.deleteById(id);
  }
}
