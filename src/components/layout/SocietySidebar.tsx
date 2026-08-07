"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, PlusCircle, List, Settings, FileText } from 'lucide-react'

const navItems = [
  { href: '/society/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/society/submit', label: 'New Opportunity', icon: PlusCircle },
  { href: '/society/submissions', label: 'My Submissions', icon: List },
  { href: '/society/drafts', label: 'Drafts', icon: FileText },
  { href: '/society/profile', label: 'Society Profile', icon: Settings },
]

export function SocietySidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-primary">SkillLinkr</h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-semibold">Society Portal</p>
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
              {item.label === 'Drafts' && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500">
                  1
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            TS
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Tech Society</p>
            <p className="text-xs text-muted-foreground truncate">KIIT University</p>
          </div>
        </div>
      </div>
    </div>
  )
}
