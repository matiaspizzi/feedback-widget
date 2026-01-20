"use client";

import { useFormState } from "react-dom";
import { loginAction, registerAction } from "@actions/auth";
import { AuthState } from "@actions/types";
import Link from "next/link";
import { Input, Button } from "@components/ui";

interface SignInProps {
  mode: "login" | "register";
}

export function SignIn({ mode }: SignInProps) {
  const isLogin = mode === "login";

  const [state, formAction] = useFormState(
    (s: AuthState | null | undefined, f: FormData) =>
      isLogin ? loginAction(s, f) : registerAction(s, f),
    null,
  );

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Sign up to start collecting feedback today"}
        </p>

        <form className="auth-form" action={formAction}>
          {!isLogin && (
            <div className="form-group">
              <Input label="Name" name="name" type="text" required />
              {state?.errors?.name && (
                <p className="field-error">{state.errors.name[0]}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <Input label="Email" type="email" name="email" required />
            {state?.errors?.email && (
              <p className="field-error">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="form-group">
            <Input label="Password" type="password" name="password" required />
            {state?.errors?.password && (
              <p className="field-error">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <div className="error-message">{state.message}</div>
          )}

          <Button type="submit" label={isLogin ? "Sign In" : "Get Started"} />
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              Don&apos;t have an account?{" "}
              <Link href="/register">Create one</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
