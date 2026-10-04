import type { DashboardStat, RecentApplication } from "@/lib/types"

export const mockUser = {
  name: "Chomnan",
  email: "demo@example.com",
  initials: "C",
}

export const mockStats: DashboardStat[] = [
  { id: "total", label: "Total Applications", value: "24" },
  { id: "interviews", label: "Interviews", value: "4" },
  { id: "offers", label: "Offers", value: "1" },
  {
    id: "response-rate",
    label: "Response Rate",
    value: "50%",
    detail: "11 replies from 22 submitted",
  },
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
  {
    id: "app-pebble",
    company: "Pebble Studio",
    position: "Full Stack Engineer",
    status: "rejected",
    appliedOn: "2026-09-08",
    appliedLabel: "Sep 8, 2026",
  },
]

export const mockInsights = [
  "3 jobs strongly match your current skills.",
  "Docker is the most frequently requested missing skill.",
]
