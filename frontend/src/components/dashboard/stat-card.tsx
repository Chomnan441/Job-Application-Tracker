import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: string
  detail?: string
  icon: LucideIcon
}

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card className="h-full rounded-lg border border-border shadow-soft ring-0">
      <CardContent className="flex h-full flex-col gap-3">
        <div className="flex min-h-10 items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
        {detail ? (
          <p className="text-sm text-muted-foreground">{detail}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
