"use client"

import { useState } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { NotificationBell } from '../notifications/NotificationBell'
import { Menu } from 'lucide-react'

export function AdminLayoutWrapper({ children, userName = "Admin User", role = "Super Admin" }: { children: React.ReactNode, userName?: string, role?: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar handles its own mobile overlay and drawer functionality */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userName={userName}
        role={role}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile Top Navigation Bar */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-accent rounded-lg text-muted-foreground"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-bold text-primary">SkillLinkr</span>
          </div>
          <NotificationBell />
        </header>

        {/* Desktop Notification Bell (Positioned absolutely as it was before, or in a header) */}
        <div className="hidden md:block absolute top-4 right-4 z-10">
          <NotificationBell />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
