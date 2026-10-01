import type { DashboardStat, RecentApplication } from "@/lib/types"

export const mockUser = {
  name: "Demo User",
  email: "demo@example.com",
  initials: "DU",
}

export const mockStats: DashboardStat[] = [
  { id: "total", label: "Total applications", value: 24 },
  { id: "applied", label: "Applied", value: 11 },
  { id: "interview", label: "Interview", value: 4 },
  { id: "offer", label: "Offer", value: 1 },
  { id: "rejected", label: "Rejected", value: 6 },
]

export const mockRecentApplications: RecentApplication[] = [
  {
    id: "app-northwind",
    company: "Northwind Labs",
    position: "Frontend Engineer",
    status: "interview",
    appliedOn: "2026-09-28",
    appliedLabel: "Sep 28, 2026",
  },
  {
    id: "app-lumen",
    company: "Lumen Health",
    position: "Product Designer",
    status: "applied",
    appliedOn: "2026-09-25",
    appliedLabel: "Sep 25, 2026",
  },
  {
    id: "app-harbor",
    company: "Harbor & Co.",
    position: "Backend Engineer",
    status: "offer",
    appliedOn: "2026-09-20",
    appliedLabel: "Sep 20, 2026",
  },
  {
    id: "app-fieldnote",
    company: "Fieldnote",
    position: "Data Analyst",
    status: "wishlist",
    appliedOn: "2026-09-12",
    appliedLabel: "Sep 12, 2026",
  },
]

export const mockInsights = [
  "4 applications still need a skill analysis.",
  "TypeScript and system design are the most common gaps.",
  "Northwind Labs is your closest skill match so far.",
]
