export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"

export type DashboardStat = {
  id: "total" | "applied" | "interview" | "offer" | "rejected"
  label: string
  value: number
}

export type RecentApplication = {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  appliedOn: string
  appliedLabel: string
}
