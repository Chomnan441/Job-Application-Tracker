export const applicationStatuses = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const

export type ApplicationStatus = (typeof applicationStatuses)[number]

export const workTypes = ["onsite", "hybrid", "remote"] as const

export type WorkType = (typeof workTypes)[number]

export type ApplicationFormData = {
  company: string
  position: string
  jobDescription: string
  jobUrl: string
  location: string
  workType: WorkType
  status: ApplicationStatus
  appliedOn: string
  notes: string
}

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
  workType?: WorkType
  jobDescription?: string
  jobUrl?: string
  notes?: string
}
