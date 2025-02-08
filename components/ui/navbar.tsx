"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, BookOpen, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: typeof Home
}

interface NavBarProps {
  activePage?: string
  className?: string
  navItems?: NavItem[]
}

export const defaultNavItems: NavItem[] = [
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

export function NavBar({ activePage, className, navItems = defaultNavItems }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(activePage || pathname)

  useEffect(() => {
    const currentItem = navItems.find(item => 
      pathname === item.url || // exact match
      (item.url !== "/" && pathname.startsWith(item.url)) // starts with, but exclude root path
    )
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [pathname, navItems])

  useEffect(() => {
    const handleResize = () => {
      window.removeEventListener("resize", handleResize)
    }

    window.addEventListener("resize", handleResize)
    return handleResize
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className
      )}
    >
      <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary"
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
