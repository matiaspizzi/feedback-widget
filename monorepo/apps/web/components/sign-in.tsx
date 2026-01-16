"use client"

import { useFormState } from "react-dom"
import { loginAction, registerAction } from "@/actions/auth"
import Link from "next/link"
import { AuthState } from "../actions/types"

interface SignInProps {
  mode: "login" | "register"
}

export function SignIn({ mode }: SignInProps) {
  const isLogin = mode === "login"

  const [state, formAction] = useFormState(
    (s: AuthState | null | undefined, f: FormData) => isLogin ? loginAction(s, f) : registerAction(s, f),
    null
  )

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
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
              />
              {state?.errors?.name && (
                <p className="field-error">{state.errors.name[0]}</p>
              )}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
            {state?.errors?.email && (
              <p className="field-error">{state.errors.email[0]}</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
            />
            {state?.errors?.password && (
              <p className="field-error">{state.errors.password[0]}</p>
            )}
          </div>

          {state?.message && (
            <div className="error-message">
              {state.message}
            </div>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? "Sign In" : "Get Started"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              Don&apos;t have an account? <Link href="/register">Create one</Link>
            </p>
          ) : (
            <p>
              Already have an account? <Link href="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}