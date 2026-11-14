import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type ApplicationActionsMenuProps = {
  company: string
  onView: () => void
  onEdit: () => void
  onDelete: () => void
}

export function ApplicationActionsMenu({
  company,
  onView,
  onEdit,
  onDelete,
}: ApplicationActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Actions for ${company}`}
        >
          <MoreHorizontal aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={onView}>View details</DropdownMenuItem>
        <DropdownMenuItem onSelect={onEdit}>Edit application</DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          Delete application
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
