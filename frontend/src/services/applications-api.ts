import { formatAppliedDate } from "@/lib/application-form"
import {
  applicationStatuses,
  workTypes,
  type ApplicationStatus,
  type JobApplication,
  type WorkType,
} from "@/lib/types"

type ApplicationResponse = {
  id: string
  company: string
  position: string
  jobDescription: string
  jobUrl: string
  location: string
  workType: string
  status: string
  appliedOn: string | null
  notes: string
}

export class ApplicationsApiError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "ApplicationsApiError"
  }
}

export async function listApplications(): Promise<JobApplication[]> {
  let response: Response
  try {
    response = await fetch("/api/applications")
  } catch {
    throw new ApplicationsApiError("Could not reach the applications API.")
  }

  if (!response.ok) {
    throw new ApplicationsApiError(await readErrorMessage(response))
  }

  let body: unknown
  try {
    body = await response.json()
  } catch {
    throw new ApplicationsApiError("The applications API returned an unexpected response.")
  }

  if (!Array.isArray(body)) {
    throw new ApplicationsApiError("The applications API returned an unexpected response.")
  }

  return body.map(toJobApplication)
}

async function readErrorMessage(response: Response) {
  try {
    const body: unknown = await response.json()
    if (
      body &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string" &&
      body.error.length > 0
    ) {
      return body.error
    }
  } catch {
    return "Could not load applications."
  }

  return "Could not load applications."
}

function toJobApplication(value: unknown): JobApplication {
  if (!isApplicationResponse(value)) {
    throw new ApplicationsApiError("The applications API returned an unexpected response.")
  }

  return {
    id: value.id,
    company: value.company,
    position: value.position,
    location: value.location,
    status: value.status,
    appliedOn: value.appliedOn,
    appliedLabel: value.appliedOn ? formatAppliedDate(value.appliedOn) : "Not applied",
    workType: value.workType,
    jobDescription: value.jobDescription,
    jobUrl: value.jobUrl,
    notes: value.notes,
  }
}

function isApplicationResponse(value: unknown): value is ApplicationResponse & {
  workType: WorkType
  status: ApplicationStatus
} {
  if (!value || typeof value !== "object") {
    return false
  }

  const application = value as Partial<ApplicationResponse>
  return (
    typeof application.id === "string" &&
    typeof application.company === "string" &&
    typeof application.position === "string" &&
    typeof application.location === "string" &&
    isWorkType(application.workType) &&
    isStatus(application.status) &&
    (application.appliedOn === null || typeof application.appliedOn === "string") &&
    typeof application.jobDescription === "string" &&
    typeof application.jobUrl === "string" &&
    typeof application.notes === "string"
  )
}

function isWorkType(value: unknown): value is WorkType {
  return typeof value === "string" && workTypes.some((item) => item === value)
}

function isStatus(value: unknown): value is ApplicationStatus {
  return typeof value === "string" && applicationStatuses.some((item) => item === value)
}
