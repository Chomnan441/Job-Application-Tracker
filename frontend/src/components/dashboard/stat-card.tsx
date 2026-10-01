import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  label: string
  value: number
  icon: LucideIcon
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="rounded-lg border border-border shadow-soft ring-0">
      <CardContent className="flex flex-col gap-3">
        <div className="flex min-h-10 items-start justify-between gap-3">
          <p className="text-sm text-muted-foreground">{label}</p>
          <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
            <Icon aria-hidden="true" className="size-4" />
          </span>
        </div>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
