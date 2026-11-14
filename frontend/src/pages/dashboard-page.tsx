import { useEffect, useMemo, useState } from "react"
import { Files, Handshake, MessagesSquare, Percent } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { InsightsSummary } from "@/components/dashboard/insights-summary"
import { RecentApplications } from "@/components/dashboard/recent-applications"
import { StatCard } from "@/components/dashboard/stat-card"
import { Button } from "@/components/ui/button"
import { listApplications } from "@/services/applications-api"
import {
  applicationStatuses,
  type ApplicationStatus,
  type DashboardStat,
  type JobApplication,
} from "@/lib/types"

const statIcons: Record<DashboardStat["id"], LucideIcon> = {
  total: Files,
  interviews: MessagesSquare,
  offers: Handshake,
  "response-rate": Percent,
}

const replyStatuses = new Set<ApplicationStatus>(["interview", "offer", "rejected"])

function emptyCounts(): Record<ApplicationStatus, number> {
  return {
    wishlist: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  }
}

function countByStatus(applications: JobApplication[]) {
  const counts = emptyCounts()
  for (const application of applications) {
    counts[application.status] += 1
  }
  return counts
}

function responseDetail(replies: number, submitted: number) {
  if (submitted === 0) {
    return "No submitted applications"
  }

  const replyLabel = replies === 1 ? "1 reply" : `${replies} replies`
  return `${replyLabel} from ${submitted} submitted`
}

function dashboardStats(applications: JobApplication[], counts: Record<ApplicationStatus, number>) {
  const submitted = applications.filter((application) => application.status !== "wishlist").length
  const replies = applicationStatuses.reduce(
    (total, status) => total + (replyStatuses.has(status) ? counts[status] : 0),
    0,
  )
  const rate = submitted === 0 ? 0 : Math.round((replies / submitted) * 100)

  const stats: DashboardStat[] = [
    { id: "total", label: "Total Applications", value: String(applications.length) },
    { id: "interviews", label: "Interviews", value: String(counts.interview) },
    { id: "offers", label: "Offers", value: String(counts.offer) },
    {
      id: "response-rate",
      label: "Response Rate",
      value: `${rate}%`,
      detail: responseDetail(replies, submitted),
    },
  ]

  return stats
}

export function DashboardPage() {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError(null)

    listApplications()
      .then((nextApplications) => {
        if (active) {
          setApplications(nextApplications)
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setLoadError(cause instanceof Error ? cause.message : "Could not load applications.")
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const counts = useMemo(() => countByStatus(applications), [applications])
  const stats = useMemo(() => dashboardStats(applications, counts), [applications, counts])
  const recentApplications = applications.slice(0, 5)

  function retryLoad() {
    setReloadKey((current) => current + 1)
  }

  if (loading) {
    return (
      <p
        role="status"
        className="rounded-lg border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-soft"
      >
        Loading applications.
      </p>
    )
  }

  if (loadError) {
    return (
      <section
        role="alert"
        className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card px-4 py-10 text-center shadow-soft"
      >
        <p className="text-sm text-muted-foreground">{loadError}</p>
        <Button type="button" variant="outline" onClick={retryLoad}>
          Retry
        </Button>
      </section>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">
          Overview
        </h2>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.id} className="h-full">
              <StatCard
                label={stat.label}
                value={stat.value}
                detail={stat.detail}
                icon={statIcons[stat.id]}
              />
            </li>
          ))}
        </ul>
      </section>
      <div className="grid gap-4 lg:grid-cols-5">
        <RecentApplications className="lg:col-span-3" applications={recentApplications} />
        <InsightsSummary className="lg:col-span-2" counts={counts} />
      </div>
    </div>
  )
}
