import { z } from 'zod';

export const feedbackSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  userId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  timestamp: z.string().datetime(),
  context: z.object({
    userAgent: z.string(),
    url: z.string(),
  }).optional(),
});

export type FeedbackPayload = z.infer<typeof feedbackSchema>;

export interface SDKConfig {
  projectId: string;
  apiKey: string;
  apiUrl: string;
  debug?: boolean;
}