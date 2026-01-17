import { FeedbackRepository } from "@/repositories/feedback-repository";
import { FeedbackService } from "@/services/feedback-service";
import { ApiKeyRepository } from "@/repositories/apikey-repository";
import { ApiKeyService } from "@/services/apikey-service";
import { UserRepository } from "@/repositories/user-repository";
import { UserService } from "@/services/user-service";

export const getFeedbackDeps = () => ({
  feedbackService: new FeedbackService(new FeedbackRepository()),
});

export const getApiKeyDeps = () => ({
  apiKeyService: new ApiKeyService(new ApiKeyRepository()),
  userService: new UserService(new UserRepository()),
});