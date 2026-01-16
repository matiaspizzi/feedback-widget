import Link from "next/link"
import "./DashboardHeader.css"

export function DashboardHeader() {
  return (
    <header className="dashboard-header">
      <div>
        <h1 className="dashboard-title">
          <span className="dashboard-title-highlight">API Keys</span> Management
        </h1>
      </div>
      <Link href="/" className="dashboard-home-link">
        Home
      </Link>
    </header>
  )
}
