import { auth, signOut } from "@/auth"
import Link from "next/link"
import { Button } from "@components/ui"

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
            <Link href="/dashboard" className="auth-button" style={{
              textDecoration: 'none',
              textAlign: 'center',
              display: 'block',
              marginBottom: '1rem',
              background: 'linear-gradient(135deg, #0070f3 0%, #00a1ff 100%)'
            }}>
              Go to Dashboard
            </Link>
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <Button type="submit" label="Logout" variant="secondary" />
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
