import { Badge } from "@/components/ui/badge"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

const statusStyles: Record<ApplicationStatus, string> = {
  wishlist: "bg-muted text-muted-foreground",
  applied: "bg-blue-100 text-blue-800",
  interview: "bg-purple-100 text-purple-800",
  offer: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-50 text-red-700/80",
}

export const applicationStatusLabels: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
}

type ApplicationStatusBadgeProps = {
  status: ApplicationStatus
}

export function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("rounded-full border-transparent", statusStyles[status])}
    >
      {applicationStatusLabels[status]}
    </Badge>
  )
}
