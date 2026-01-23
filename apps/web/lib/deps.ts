import {
  FeedbackRepository,
  ApiKeyRepository,
  UserRepository,
} from "@repositories";
import { FeedbackService, UserService, ApiKeyService } from "@services";

// Singleton instances
const feedbackRepository = new FeedbackRepository();
const apiKeyRepository = new ApiKeyRepository();
const userRepository = new UserRepository();

const feedbackService = new FeedbackService(feedbackRepository);
const apiKeyService = new ApiKeyService(apiKeyRepository);
const userService = new UserService(userRepository);

export const getFeedbackDeps = () => ({
  feedbackService,
});

export const getApiKeyDeps = () => ({
  apiKeyService,
});

export const getAuthDeps = () => ({
  userService,
});
