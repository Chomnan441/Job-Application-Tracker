import {
  CircleX,
  Files,
  Handshake,
  MessagesSquare,
  Send,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { InsightsSummary } from "@/components/dashboard/insights-summary"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { StatCard } from "@/components/dashboard/stat-card"
import {
  mockInsights,
  mockRecentApplications,
  mockStats,
} from "@/data/mock-dashboard"
import type { DashboardStat } from "@/lib/types"

const statIcons: Record<DashboardStat["id"], LucideIcon> = {
  total: Files,
  applied: Send,
  interview: MessagesSquare,
  offer: Handshake,
  rejected: CircleX,
}

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">
          Overview
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
          {mockStats.map((stat) => (
            <li
              key={stat.id}
              className={stat.id === "rejected" ? "col-span-2 md:col-span-1" : undefined}
            >
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={statIcons[stat.id]}
              />
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-4 lg:grid-cols-5">
        <RecentApplications
          className="lg:col-span-3"
          applications={mockRecentApplications}
        />
        <InsightsSummary className="lg:col-span-2" insights={mockInsights} />
      </div>
    </div>
  )
}
