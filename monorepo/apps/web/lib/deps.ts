import { FeedbackRepository, ApiKeyRepository, UserRepository } from "@repositories";
import { FeedbackService, UserService, ApiKeyService } from "@services";

export const getFeedbackDeps = () => ({
  feedbackService: new FeedbackService(new FeedbackRepository()),
});

export const getApiKeyDeps = () => ({
  apiKeyService: new ApiKeyService(new ApiKeyRepository()),
  userService: new UserService(new UserRepository()),
});

export const getAuthDeps = () => ({
  userService: new UserService(new UserRepository()),
});
