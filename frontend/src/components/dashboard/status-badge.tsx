import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import type { ApplicationStatus } from "@/lib/types"

type StatusBadgeProps = {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <ApplicationStatusBadge status={status} />
}
