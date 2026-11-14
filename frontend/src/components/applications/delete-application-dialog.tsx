import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { JobApplication } from "@/lib/types"

type DeleteApplicationDialogProps = {
  application: JobApplication | null
  onOpenChange: (open: boolean) => void
  onDelete: (id: string) => Promise<void>
}

export function DeleteApplicationDialog({
  application,
  onOpenChange,
  onDelete,
}: DeleteApplicationDialogProps) {
  const [visible, setVisible] = useState<JobApplication | null>(application)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const open = application !== null

  useEffect(() => {
    if (!application) {
      return
    }

    setVisible(application)
    setDeleteError(null)
  }, [application])

  function handleOpenChange(nextOpen: boolean) {
    if (deleting) {
      return
    }

    if (!nextOpen) {
      setDeleteError(null)
    }
    onOpenChange(nextOpen)
  }

  async function handleDelete() {
    if (!visible) {
      return
    }

    setDeleting(true)
    setDeleteError(null)
    try {
      await onDelete(visible.id)
      setDeleteError(null)
      onOpenChange(false)
    } catch (cause) {
      setDeleteError(
        cause instanceof Error ? cause.message : "Could not delete the application.",
      )
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete application</DialogTitle>
          <DialogDescription>
            This removes {visible?.company ?? "this application"}. This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        {deleteError ? (
          <p role="alert" className="text-sm text-destructive">
            {deleteError}
          </p>
        ) : null}
        <DialogFooter>
          <Button type="button" variant="outline" disabled={deleting} onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete}>
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
