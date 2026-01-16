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

export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string()
    .min(1, "El nombre es obligatorio")
    .regex(/^[a-zA-Z.]+$/, "El nombre solo puede contener letras y puntos")
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export interface SDKConfig {
  projectId: string;
  apiKey: string;
  apiUrl: string;
  debug?: boolean;
}