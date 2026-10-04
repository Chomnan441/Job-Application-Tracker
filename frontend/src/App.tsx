import { BrowserRouter, Route, Routes } from "react-router"
import { AppShell } from "@/components/layout/app-shell"
import { ApplicationsPage } from "@/pages/applications-page"
import { DashboardPage } from "@/pages/dashboard-page"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AppShell
              title="Good morning, Chomnan"
              description="Here's how your job search is going."
              showAddApplication
            >
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/applications"
          element={
            <AppShell
              title="Job Applications"
              description="Track and manage all your job applications."
            >
              <ApplicationsPage />
            </AppShell>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
