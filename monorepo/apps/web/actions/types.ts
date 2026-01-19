export interface AuthState {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
  message?: string;
}

export type ActionResponse<T = void> =
  | { success: true; data: T; error?: never }
  | { success: false; data?: never; error: string };