import { ApplicationActionsMenu } from "@/components/applications/application-actions-menu"
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import type { JobApplication } from "@/lib/types"

type ApplicationTableProps = {
  applications: JobApplication[]
}

function AppliedDate({ application }: { application: JobApplication }) {
  if (!application.appliedOn) {
    return <span className="text-muted-foreground">{application.appliedLabel}</span>
  }

  return (
    <time dateTime={application.appliedOn} className="text-muted-foreground">
      {application.appliedLabel}
    </time>
  )
}

export function ApplicationTable({ applications }: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="border-b border-border text-muted-foreground">
          <tr>
            <th scope="col" className="px-4 py-3 font-medium">
              Company
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Position
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Location
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Applied date
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              Status
            </th>
            <th scope="col" className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b border-border last:border-b-0">
              <th scope="row" className="px-4 py-4 font-medium">
                {application.company}
              </th>
              <td className="px-4 py-4">{application.position}</td>
              <td className="px-4 py-4 text-muted-foreground">{application.location}</td>
              <td className="px-4 py-4">
                <AppliedDate application={application} />
              </td>
              <td className="px-4 py-4">
                <ApplicationStatusBadge status={application.status} />
              </td>
              <td className="px-4 py-4 text-right">
                <ApplicationActionsMenu company={application.company} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
