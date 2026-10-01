import { cn } from "@/lib/utils"
import { navItems } from "@/components/layout/nav-items"

type AppNavProps = {
  onNavigate?: () => void
}

export function AppNav({ onNavigate }: AppNavProps) {
  return (
    <nav aria-label="Main" className="px-3">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={item.available ? "page" : undefined}
                aria-disabled={item.available ? undefined : true}
                title={
                  item.available
                    ? undefined
                    : "This page will be added in a later step"
                }
                onClick={() => {
                  if (item.available) onNavigate?.()
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                  item.available
                    ? "bg-accent font-medium text-primary"
                    : "text-sidebar-foreground hover:bg-accent/70",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                {item.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
