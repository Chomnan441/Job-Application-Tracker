import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

type InsightsSummaryProps = {
  insights: string[]
  className?: string
}

export function InsightsSummary({ insights, className }: InsightsSummaryProps) {
  return (
    <section className={cn("flex flex-col", className)} aria-labelledby="insights-heading">
      <Card className="flex-1 rounded-lg border border-border shadow-soft ring-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
              <Sparkles aria-hidden="true" className="size-4" />
            </span>
            <h2 id="insights-heading" className="text-base font-medium tracking-tight">
              AI insights
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            A short read of your current search
          </p>
        </CardHeader>
        <CardContent>
          <ul className="flex flex-col gap-3">
            {insights.map((insight) => (
              <li
                key={insight}
                className="rounded-lg bg-accent/70 px-3 py-3 text-sm leading-6"
              >
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
