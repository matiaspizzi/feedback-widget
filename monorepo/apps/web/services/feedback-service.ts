import { Prisma } from "@repo/database";
import { FeedbackRepository } from "@repositories";

export class FeedbackService {
  private readonly repository: FeedbackRepository;

  constructor(repository: FeedbackRepository) {
    this.repository = repository;
  }

  async getById(id: string) {
    return this.repository.getById(id);
  }

  async getByProjectId(projectId: string) {
    return this.repository.getWithFilters({ projectId });
  }

  async create(data: {
    projectId: string;
    userId?: string | null;
    rating: number;
    comment?: string | null;
    metadata?: any;
  }) {
    return this.repository.create({
      projectId: data.projectId,
      userId: data.userId,
      rating: data.rating,
      comment: data.comment,
      metadata: data.metadata || Prisma.JsonNull,
    });
  }

  async delete(id: string) {
    return this.repository.deleteById(id);
  }
}
