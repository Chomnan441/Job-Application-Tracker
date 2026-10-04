import type { RecentApplication } from "@/lib/types"
import { cn } from "@/lib/utils"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type RecentApplicationsProps = {
  applications: RecentApplication[]
  className?: string
}

export function RecentApplications({
  applications,
  className,
}: RecentApplicationsProps) {
  return (
    <section className={cn("flex flex-col", className)} aria-labelledby="recent-heading">
      <Card className="flex-1 rounded-lg border border-border shadow-soft ring-0">
        <CardHeader>
          <h2 id="recent-heading" className="text-base font-medium tracking-tight">
            Recent applications
          </h2>
          <p className="text-sm text-muted-foreground">
            The latest roles in your tracker
          </p>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {applications.map((application) => (
              <li
                key={application.id}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h3 className="truncate font-medium">{application.company}</h3>
                  <p className="truncate text-sm text-muted-foreground">
                    {application.position}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={application.status} />
                  <time
                    dateTime={application.appliedOn}
                    className="text-sm whitespace-nowrap text-muted-foreground"
                  >
                    {application.appliedLabel}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
