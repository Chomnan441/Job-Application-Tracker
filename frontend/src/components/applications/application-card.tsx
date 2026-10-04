import { ApplicationActionsMenu } from "@/components/applications/application-actions-menu"
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import { Card, CardContent } from "@/components/ui/card"
import type { JobApplication } from "@/lib/types"

type ApplicationCardProps = {
  application: JobApplication
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Card className="rounded-lg border border-border shadow-soft ring-0">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-base font-medium">{application.company}</h2>
            <p className="truncate text-sm text-muted-foreground">{application.position}</p>
          </div>
          <ApplicationActionsMenu company={application.company} />
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd>{application.location}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Applied date</dt>
            <dd>
              {application.appliedOn ? (
                <time dateTime={application.appliedOn}>{application.appliedLabel}</time>
              ) : (
                application.appliedLabel
              )}
            </dd>
          </div>
        </dl>
        <ApplicationStatusBadge status={application.status} />
      </CardContent>
    </Card>
  )
}
