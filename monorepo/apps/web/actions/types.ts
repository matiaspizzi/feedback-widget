export interface AuthState {
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
  message?: string;
}
