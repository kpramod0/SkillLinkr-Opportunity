"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, CheckSquare, History, User, PlusCircle, LogOut, X } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

interface AmbassadorSidebarProps {
  isOpen: boolean
  onClose: () => void
  isSocietyMember?: boolean
  userName?: string
  collegeName?: string
  pendingReviewsCount?: number
}

export function AmbassadorSidebar({ isOpen, onClose, isSocietyMember, userName = "Ambassador", collegeName = "University", pendingReviewsCount = 0 }: AmbassadorSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const baseNavItems = [
    { href: '/ambassador/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/ambassador/queue', label: 'Review Queue', icon: CheckSquare },
    { href: '/ambassador/history', label: 'My Reviews', icon: History },
  ]

  if (isSocietyMember) {
    baseNavItems.splice(1, 0, { href: '/society/submit', label: 'Create Opportunity', icon: PlusCircle })
  }

  baseNavItems.push({ href: '/ambassador/profile', label: 'Profile', icon: User })

  const navItems = baseNavItems

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
            <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase font-semibold">Campus Ambassador</p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
              {collegeName}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-lg self-start"
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
              {item.label === 'Review Queue' && pendingReviewsCount > 0 && (
                <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                  {pendingReviewsCount}
                </span>
              )}
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
            <p className="text-xs text-muted-foreground truncate">{collegeName}</p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
