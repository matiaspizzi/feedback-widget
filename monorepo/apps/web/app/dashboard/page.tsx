import { auth } from "@/auth"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()

  return (
    <div className="dashboard-container" style={{
      minHeight: '100vh',
      padding: '2rem',
      background: 'radial-gradient(circle at top left, #1a1a1a 0%, #000000 100%)',
      color: '#fff',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        padding: '1rem 2rem',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
            <span style={{ color: 'var(--primary, #0070f3)' }}>Feedback</span> Dashboard
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            {session?.user?.email}
          </span>
          <Link href="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s'
          }}>
            Home
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          padding: '3rem',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #0070f3 0%, #00a1ff 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            fontSize: '2rem',
            boxShadow: '0 8px 32px rgba(0, 112, 243, 0.3)'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Private Dashboard</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Welcome to the secure area. Here you can manage your widgets and view detailed analytics.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginTop: '3rem'
          }}>
            {[
              { label: 'Active Widgets', value: '12', icon: '⚡' },
              { label: 'Total Feedback', value: '1,280', icon: '📝' },
              { label: 'Avg. Rating', value: '4.8', icon: '⭐' }
            ].map((stat, i) => (
              <div key={i} style={{
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{stat.icon}</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{stat.label}</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
