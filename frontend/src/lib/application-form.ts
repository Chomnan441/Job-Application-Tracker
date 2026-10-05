import { z } from "zod"
import {
  applicationStatuses,
  workTypes,
  type ApplicationFormData,
  type ApplicationStatus,
  type JobApplication,
  type WorkType,
} from "@/lib/types"

const httpUrl = /^https?:\/\/\S+$/i
const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/

export const workTypeLabels: Record<WorkType, string> = {
  onsite: "On-site",
  hybrid: "Hybrid",
  remote: "Remote",
}

function requiredChoice<const T extends string>(
  values: readonly T[],
  message: string,
) {
  return z.string().refine((value): value is T => values.some((item) => item === value), {
    error: message,
  })
}

export const applicationFormSchema = z
  .object({
    company: z
      .string()
      .trim()
      .min(1, { error: "Enter a company name." })
      .max(120, { error: "Company name must be 120 characters or fewer." }),
    position: z
      .string()
      .trim()
      .min(1, { error: "Enter a position." })
      .max(120, { error: "Position must be 120 characters or fewer." }),
    jobDescription: z
      .string()
      .trim()
      .max(5000, { error: "Job description must be 5,000 characters or fewer." }),
    jobUrl: z
      .string()
      .trim()
      .refine((value) => value.length === 0 || httpUrl.test(value), {
        error: "Enter a valid job URL, including https://.",
      }),
    location: z
      .string()
      .trim()
      .min(1, { error: "Enter a location." })
      .max(120, { error: "Location must be 120 characters or fewer." }),
    workType: requiredChoice(workTypes, "Select a work type."),
    status: requiredChoice(applicationStatuses, "Select a status."),
    appliedOn: z.string(),
    notes: z
      .string()
      .trim()
      .max(2000, { error: "Notes must be 2,000 characters or fewer." }),
  })
  .superRefine((value, context) => {
    const status = value.status as ApplicationStatus | ""
    const appliedOn = value.appliedOn.trim()

    if (appliedOn.length > 0 && !isoDate.test(appliedOn)) {
      context.addIssue({
        code: "custom",
        path: ["appliedOn"],
        message: "Enter a valid date.",
      })
    }

    if (status !== "" && status !== "wishlist" && appliedOn.length === 0) {
      context.addIssue({
        code: "custom",
        path: ["appliedOn"],
        message: "Enter the date you applied.",
      })
    }
  })

export function formatAppliedDate(isoDateValue: string) {
  const match = isoDate.exec(isoDateValue)
  if (!match) {
    return isoDateValue
  }

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(year, month - 1, day))
}

export function toJobApplication(data: ApplicationFormData): JobApplication {
  const appliedOn = data.appliedOn.trim() === "" ? null : data.appliedOn

  return {
    id: crypto.randomUUID(),
    company: data.company,
    position: data.position,
    location: data.location,
    status: data.status,
    appliedOn,
    appliedLabel: appliedOn ? formatAppliedDate(appliedOn) : "Not applied",
    workType: data.workType,
    jobDescription: data.jobDescription,
    jobUrl: data.jobUrl,
    notes: data.notes,
  }
}
