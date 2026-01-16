import { signIn } from "@/auth"
import { register } from "@/app/actions/auth"

interface SignInProps {
  mode: "login" | "register"
}

export function SignIn({ mode }: SignInProps) {
  const isLogin = mode === "login"

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isLogin ? "Welcome Back" : "Create Account"}</h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Sign up to start collecting feedback today"}
        </p>

        <form
          className="auth-form"
          action={async (formData) => {
            "use server"
            if (isLogin) {
              await signIn("credentials", formData)
            } else {
              await register(formData)
            }
          }}
        >
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="auth-button">
            {isLogin ? "Sign In" : "Get Started"}
          </button>
        </form>

        <div className="auth-footer">
          {isLogin ? (
            <p>
              Don&apos;t have an account? <a href="/register">Create one</a>
            </p>
          ) : (
            <p>
              Already have an account? <a href="/login">Sign in</a>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

