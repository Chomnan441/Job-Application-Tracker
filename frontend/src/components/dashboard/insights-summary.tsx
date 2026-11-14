import { applicationStatusLabels } from "@/components/applications/application-status-badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { applicationStatuses, type ApplicationStatus } from "@/lib/types"

type InsightsSummaryProps = {
  counts: Record<ApplicationStatus, number>
  className?: string
}

export function InsightsSummary({ counts, className }: InsightsSummaryProps) {
  return (
    <section className={cn("flex flex-col", className)} aria-labelledby="insights-heading">
      <Card className="flex-1 rounded-lg border border-border shadow-soft ring-0">
        <CardHeader>
          <h2 id="insights-heading" className="text-base font-medium tracking-tight">
            By status
          </h2>
          <p className="text-sm text-muted-foreground">Counts for each stage</p>
        </CardHeader>
        <CardContent>
          <dl className="flex flex-col gap-3">
            {applicationStatuses.map((status) => (
              <div
                key={status}
                className="flex items-center justify-between gap-3 rounded-lg bg-accent/70 px-3 py-3 text-sm"
              >
                <dt>{applicationStatusLabels[status]}</dt>
                <dd className="font-medium">{counts[status]}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
