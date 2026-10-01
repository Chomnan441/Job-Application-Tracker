import { cn } from "@/lib/utils"
import type { ApplicationStatus } from "@/lib/types"

const statusStyles: Record<ApplicationStatus, string> = {
  wishlist: "bg-violet-100 text-violet-800",
  applied: "bg-indigo-100 text-indigo-800",
  interview: "bg-amber-100 text-amber-900",
  offer: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
}

const statusLabels: Record<ApplicationStatus, string> = {
  wishlist: "Wishlist",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
}

type StatusBadgeProps = {
  status: ApplicationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status],
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
