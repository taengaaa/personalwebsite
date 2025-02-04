import { Home, User, BookOpen, Briefcase } from "lucide-react"

export interface NavItem {
  name: string
  url: string
  icon: typeof Home
}

export const navItems: NavItem[] = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "Über mich",
    url: "/uebermich",
    icon: User,
  },
  {
    name: "Blog",
    url: "/blog",
    icon: BookOpen,
  },
  {
    name: "Projekte",
    url: "/projekte",
    icon: Briefcase,
  },
]
