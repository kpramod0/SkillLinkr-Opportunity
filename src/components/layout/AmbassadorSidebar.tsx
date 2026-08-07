"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, History, User } from 'lucide-react'

const navItems = [
  { href: '/ambassador/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/ambassador/queue', label: 'Review Queue', icon: CheckSquare },
  { href: '/ambassador/history', label: 'My Reviews', icon: History },
  { href: '/ambassador/profile', label: 'Profile', icon: User },
]

export function AmbassadorSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">SkillLinkr</h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-semibold">Campus Ambassador</p>
        <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
          KIIT University
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.label === 'Review Queue' && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                  3
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">Year 3 • CSE</p>
          </div>
        </div>
      </div>
    </div>
  )
}
