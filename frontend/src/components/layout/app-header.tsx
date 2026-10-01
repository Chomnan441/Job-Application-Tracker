import { Menu, Plus } from "lucide-react"
import { mockUser } from "@/data/mock-dashboard"
import { Button } from "@/components/ui/button"

type AppHeaderProps = {
  title: string
  description?: string
  showAddApplication?: boolean
  onMenuOpen: () => void
}

export function AppHeader({
  title,
  description,
  showAddApplication = false,
  onMenuOpen,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div className="flex items-start gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          className="lg:hidden"
          aria-label="Open navigation menu"
          onClick={onMenuOpen}
        >
          <Menu aria-hidden="true" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {showAddApplication ? (
          <Button type="button" size="lg">
            <Plus data-icon="inline-start" aria-hidden="true" />
            Add Application
          </Button>
        ) : null}
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 items-center justify-center rounded-full bg-accent text-sm font-medium text-primary"
            aria-hidden="true"
          >
            {mockUser.initials}
          </span>
          <p className="min-w-0 text-left">
            <span className="block truncate text-sm font-medium">
              {mockUser.name}
            </span>
            <span className="hidden text-xs text-muted-foreground sm:block">
              {mockUser.email}
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}
