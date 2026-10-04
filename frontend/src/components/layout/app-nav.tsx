import { NavLink } from "react-router"
import { cn } from "@/lib/utils"
import { navItems } from "@/components/layout/nav-items"

type AppNavProps = {
  onNavigate?: () => void
}

const itemClassName =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"

export function AppNav({ onNavigate }: AppNavProps) {
  return (
    <nav aria-label="Main" className="px-3">
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <li key={item.id}>
              {item.to ? (
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      itemClassName,
                      isActive
                        ? "bg-accent font-medium text-primary"
                        : "text-sidebar-foreground hover:bg-accent/70",
                    )
                  }
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                </NavLink>
              ) : (
                <button
                  type="button"
                  aria-disabled="true"
                  title="This page will be added in a later step"
                  className={cn(
                    itemClassName,
                    "text-sidebar-foreground hover:bg-accent/70",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  {item.label}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
