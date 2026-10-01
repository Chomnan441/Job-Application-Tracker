import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { AppNav } from "@/components/layout/app-nav"
import { BrandMark } from "@/components/layout/brand-mark"
import { Button } from "@/components/ui/button"

type MobileNavProps = {
  open: boolean
  onClose: () => void
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  return (
    <dialog ref={dialogRef} className="mobile-nav-dialog" onClose={onClose}>
      <div className="flex items-center justify-between px-4 py-4">
        <BrandMark />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close navigation menu"
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      <AppNav onNavigate={onClose} />
    </dialog>
  )
}
