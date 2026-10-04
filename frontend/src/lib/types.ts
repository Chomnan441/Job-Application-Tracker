export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected"

export type DashboardStat = {
  id: "total" | "interviews" | "offers" | "response-rate"
  label: string
  value: string
  detail?: string
}

export type RecentApplication = {
  id: string
  company: string
  position: string
  status: ApplicationStatus
  appliedOn: string
  appliedLabel: string
}

export type JobApplication = {
  id: string
  company: string
  position: string
  location: string
  status: ApplicationStatus
  appliedOn: string | null
  appliedLabel: string
}
