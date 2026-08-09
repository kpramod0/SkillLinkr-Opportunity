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
  Settings,
  X,
  LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/admin/ambassadors', label: 'Ambassadors', icon: Users },
  { href: '/admin/societies', label: 'Societies', icon: Building2 },
  { href: '/admin/colleges', label: 'Colleges', icon: Building2 },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
  { href: '/admin/domains', label: 'Domains', icon: Layers },
  { href: '/admin/audit', label: 'Audit Logs', icon: Activity },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  role?: string;
}

export function AdminSidebar({ isOpen, onClose, userName = "Admin User", role = "Super Admin" }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r h-full flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">SkillLinkr</h2>
            <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-semibold">Opportunities Admin</p>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-lg"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
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

      <div className="p-4 border-t flex flex-col gap-2">
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-2 py-1.5 transition-colors">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
        <div className="flex items-center gap-3 mt-2">
          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{role}</p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
