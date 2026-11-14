import { useEffect, useState } from "react"
import { ApplicationStatusBadge } from "@/components/applications/application-status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { workTypeLabels } from "@/lib/application-form"
import type { JobApplication } from "@/lib/types"
import { getApplication } from "@/services/applications-api"

type ApplicationDetailDialogProps = {
  applicationId: string | null
  onOpenChange: (open: boolean) => void
}

type DetailState = {
  id: string
  status: "loading" | "error" | "ready"
  application: JobApplication | null
  error: string | null
}

export function ApplicationDetailDialog({
  applicationId,
  onOpenChange,
}: ApplicationDetailDialogProps) {
  const [detail, setDetail] = useState<DetailState | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const open = applicationId !== null
  const current = applicationId
    ? detail?.id === applicationId
      ? detail
      : null
    : detail

  useEffect(() => {
    if (!applicationId) {
      return
    }

    let active = true
    setDetail({
      id: applicationId,
      status: "loading",
      application: null,
      error: null,
    })

    getApplication(applicationId)
      .then((application) => {
        if (active) {
          setDetail({
            id: applicationId,
            status: "ready",
            application,
            error: null,
          })
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setDetail({
            id: applicationId,
            status: "error",
            application: null,
            error: cause instanceof Error ? cause.message : "Could not load the application.",
          })
        }
      })

    return () => {
      active = false
    }
  }, [applicationId, reloadKey])

  const application = current?.status === "ready" ? current.application : null
  const error = current?.status === "error" ? current.error : null

  function retry() {
    if (!applicationId) {
      return
    }

    setDetail({
      id: applicationId,
      status: "loading",
      application: null,
      error: null,
    })
    setReloadKey((key) => key + 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[min(42rem,calc(100dvh-2rem))] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="px-4 pt-4 pr-12">
          <DialogTitle>{application?.company ?? "Application details"}</DialogTitle>
          <DialogDescription>
            {application?.position ??
              (error ? "Could not load this application." : "Loading this application.")}
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {application ? (
            <ApplicationDetails application={application} />
          ) : error ? (
            <section
              role="alert"
              className="flex flex-col items-center gap-3 py-8 text-center"
            >
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button type="button" variant="outline" onClick={retry}>
                Retry
              </Button>
            </section>
          ) : (
            <p role="status" className="py-8 text-center text-sm text-muted-foreground">
              Loading application.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ApplicationDetails({ application }: { application: JobApplication }) {
  const workType = application.workType ? workTypeLabels[application.workType] : ""

  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      <DetailItem label="Location" value={application.location} />
      <DetailItem label="Work type" value={workType} />
      <div>
        <dt className="text-sm text-muted-foreground">Status</dt>
        <dd className="mt-1">
          <ApplicationStatusBadge status={application.status} />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted-foreground">Applied date</dt>
        <dd className="mt-1">
          {application.appliedOn ? (
            <time dateTime={application.appliedOn}>{application.appliedLabel}</time>
          ) : (
            <span className="text-muted-foreground">{application.appliedLabel}</span>
          )}
        </dd>
      </div>
      <DetailText label="Job description" value={application.jobDescription ?? ""} />
      <DetailLink label="Job URL" value={application.jobUrl ?? ""} />
      <DetailText label="Notes" value={application.notes ?? ""} />
    </dl>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  const text = value.trim()

  return (
    <div>
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1">{text || <EmptyValue />}</dd>
    </div>
  )
}

function DetailText({ label, value }: { label: string; value: string }) {
  const text = value.trim()

  return (
    <div className="sm:col-span-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap">{text || <EmptyValue />}</dd>
    </div>
  )
}

function DetailLink({ label, value }: { label: string; value: string }) {
  const text = value.trim()
  const isHttp = /^https?:\/\//i.test(text)

  return (
    <div className="sm:col-span-2">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-all">
        {isHttp ? (
          <a href={text} target="_blank" rel="noreferrer" className="underline underline-offset-3">
            {text}
          </a>
        ) : (
          text || <EmptyValue />
        )}
      </dd>
    </div>
  )
}

function EmptyValue() {
  return <span className="text-muted-foreground">None</span>
}
