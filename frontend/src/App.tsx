import { AppShell } from "@/components/layout/app-shell"
import { DashboardPage } from "@/pages/dashboard-page"

export default function App() {
  return (
    <AppShell
      title="Dashboard"
      description="A snapshot of your job search."
      showAddApplication
    >
      <DashboardPage />
    </AppShell>
  )
}
