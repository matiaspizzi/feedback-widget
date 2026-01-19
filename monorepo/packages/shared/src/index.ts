import { z } from 'zod';

export const feedbackSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  userId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(250, "Comment must be at most 250 characters long").optional(),
  timestamp: z.iso.datetime(),
  context: z.object({
    userAgent: z.string(),
    url: z.string(),
  }).optional(),
});

export type FeedbackPayload = z.infer<typeof feedbackSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z.]+$/, "Name can only contain letters and dots")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface SDKConfig {
  projectId: string;
  apiKey: string;
  apiUrl: string;
  debug?: boolean;
}

export const apiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(20, "Name must be at most 20 characters long").regex(/^[a-zA-Z0-9_-]+$/, "Name can only contain letters, numbers, hyphens and underscores"),
  expiresAt: z.preprocess((arg) => {
    if (typeof arg === "string" && arg.length > 0) return new Date(arg);
    return arg;
  }, z.date().optional().nullable().refine((date) => {
    if (!date) return true;
    return date > new Date();
  }, "Expiration date must be in the future")),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;