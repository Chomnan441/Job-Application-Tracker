import { AppNav } from "@/components/layout/app-nav"
import { BrandMark } from "@/components/layout/brand-mark"

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="px-5 py-5">
        <BrandMark />
      </div>
      <AppNav />
    </aside>
  )
}
