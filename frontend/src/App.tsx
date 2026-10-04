import { AppShell } from "@/components/layout/app-shell"
import { DashboardPage } from "@/pages/dashboard-page"

export default function App() {
  return (
    <AppShell
      title="Good morning, Chomnan"
      description="Here's how your job search is going."
      showAddApplication
    >
      <DashboardPage />
    </AppShell>
  )
}
