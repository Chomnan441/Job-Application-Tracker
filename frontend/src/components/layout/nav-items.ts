import type { LucideIcon } from "lucide-react"
import {
  Briefcase,
  LayoutDashboard,
  Layers,
  Mail,
  Settings,
  Sparkles,
} from "lucide-react"

export type NavItem = {
  id: string
  label: string
  icon: LucideIcon
  to?: string
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { id: "applications", label: "Applications", icon: Briefcase, to: "/applications" },
  { id: "analyzer", label: "AI Analyzer", icon: Sparkles },
  { id: "cover-letters", label: "Cover Letters", icon: Mail },
  { id: "skills", label: "Skills", icon: Layers },
  { id: "settings", label: "Settings", icon: Settings },
]
