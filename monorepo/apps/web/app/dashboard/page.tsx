import { DashboardHeader } from "./components/DashboardHeader"
import { ApiKeyTable } from "./components/ApiKeyTable"
import "./page.css"

export default function DashboardPage() {
  return (
    <div className="dashboard-page">
      <DashboardHeader />
      <main className="dashboard-main">
        <ApiKeyTable />
      </main>
    </div>
  )
}
