import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { ApplicationCard } from "@/components/applications/application-card"
import { ApplicationTable } from "@/components/applications/application-table"
import { applicationStatusLabels } from "@/components/applications/application-status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { mockApplications } from "@/data/mock-applications"
import type { ApplicationStatus } from "@/lib/types"

const statuses = Object.keys(applicationStatusLabels) as ApplicationStatus[]

type StatusFilter = ApplicationStatus | "all"

export function ApplicationsPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<StatusFilter>("all")

  const applications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mockApplications.filter((application) => {
      const matchesStatus = status === "all" || application.status === status
      const haystack = `${application.company} ${application.position} ${application.location}`.toLowerCase()
      const matchesQuery = normalizedQuery.length === 0 || haystack.includes(normalizedQuery)
      return matchesStatus && matchesQuery
    })
  }, [query, status])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-72">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="application-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search company or position"
              aria-label="Search applications"
              className="h-9 bg-card pl-8"
            />
          </div>
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as StatusFilter)}
          >
            <SelectTrigger
              id="status-filter"
              aria-label="Filter by status"
              className="h-9 w-full bg-card sm:w-44"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent
              position="popper"
              side="bottom"
              align="start"
              sideOffset={4}
              avoidCollisions={false}
            >
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((item) => (
                <SelectItem key={item} value={item}>
                  {applicationStatusLabels[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="button" size="lg" className="self-start">
          <Plus data-icon="inline-start" aria-hidden="true" />
          Add Application
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {applications.length} of {mockApplications.length}
      </p>

      {applications.length === 0 ? (
        <p className="rounded-lg border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground shadow-soft">
          No applications match this search.
        </p>
      ) : (
        <>
          <div className="hidden md:block">
            <ApplicationTable applications={applications} />
          </div>
          <ul className="flex flex-col gap-3 md:hidden">
            {applications.map((application) => (
              <li key={application.id}>
                <ApplicationCard application={application} />
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
