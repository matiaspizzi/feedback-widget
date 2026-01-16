import { auth, signOut } from "@/auth"
import Link from "next/link"

export default async function IndexPage() {
  const session = await auth()

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1 className="auth-title">Feedback Widget</h1>
        <p className="auth-subtitle">Collect and manage user feedback with ease</p>

        {session ? (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Welcome back, <strong>{session.user?.name || session.user?.email}</strong>!
            </p>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <button type="submit" className="auth-button" style={{ width: '100%' }}>
                Logout
              </button>
            </form>
          </div>
        ) : (
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/login" className="auth-button" style={{ textDecoration: 'none', textAlign: 'center' }}>
              Sign In
            </Link>
            <Link href="/register" className="auth-button" style={{ background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', textDecoration: 'none', textAlign: 'center' }}>
              Create Account
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
