import { Prisma } from "@repo/database";
import { FeedbackRepository } from "@repositories";
import { BadRequestError, NotFoundError } from "@lib/errors";

export class FeedbackService {
  private readonly repository: FeedbackRepository;

  constructor(repository: FeedbackRepository) {
    this.repository = repository;
  }

  async getById(id: string) {
    const feedback = await this.repository.getById(id);
    if (!feedback) throw new NotFoundError("Feedback");
    return feedback;
  }

  async getByProjectId(projectId: string) {
    if (!projectId) {
      throw new BadRequestError("Project ID is required");
    }
    return this.repository.getWithFilters({ projectId });
  }

  async create(data: {
    projectId: string;
    userId?: string | null;
    rating: number;
    comment?: string | null;
    metadata?: any;
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw new BadRequestError("Rating must be between 1 and 5");
    }

    return this.repository.create({
      projectId: data.projectId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      metadata: data.metadata || Prisma.JsonNull,
    });
  }

  async delete(id: string) {
    const exists = await this.repository.getById(id);
    if (!exists) {
      throw new NotFoundError("Feedback");
    }
    return this.repository.deleteById(id);
  }
}
