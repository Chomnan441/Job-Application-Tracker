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
  available: boolean
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, available: true },
  { id: "applications", label: "Applications", icon: Briefcase, available: false },
  { id: "analyzer", label: "AI Analyzer", icon: Sparkles, available: false },
  { id: "cover-letters", label: "Cover Letters", icon: Mail, available: false },
  { id: "skills", label: "Skills", icon: Layers, available: false },
  { id: "settings", label: "Settings", icon: Settings, available: false },
]
