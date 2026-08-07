"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Tags, 
  Layers, 
  Briefcase, 
  Activity, 
  BarChart3, 
  Settings 
} from 'lucide-react'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/ambassadors', label: 'Ambassadors', icon: Users },
  { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/domains', label: 'Domains', icon: Layers },
  { href: '/admin/audit', label: 'Audit Logs', icon: Activity },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-card border-r h-full flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-primary">SkillLinkr</h2>
        <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-semibold">Opportunities Admin</p>
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
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            AD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
