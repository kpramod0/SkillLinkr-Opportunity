"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Bell, Check, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase-client'

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        
        const { data } = await supabase
          .from('opp_notifications')
          .select('*')
          .eq('recipient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)
          
        if (data) {
          setNotifications(data)
        }
      } catch (e) {}
    }

    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures it runs EXACTLY once

  const unreadCount = notifications.filter(n => !n.read_at).length

  const handleMarkRead = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    
    await supabase
      .from('opp_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id)
      .eq('recipient_id', user.id)
      
    setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
  }

  const handleMarkAllRead = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('opp_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('recipient_id', user.id)
      .is('read_at', null)
      
    setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })))
  }

  return (
    <div className="fixed top-4 right-8 z-50">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 bg-background border shadow-sm rounded-full hover:bg-muted transition-colors"
        >
          <Bell className="h-5 w-5 text-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
          )}
        </button>

        {isOpen && (
          <div className="absolute top-full right-0 mt-2 w-80 max-h-[80vh] bg-card border rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
              <h3 className="font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-primary font-medium hover:underline">
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  You have no notifications.
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-4 flex gap-3 transition-colors ${!n.read_at ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
                      onClick={() => !n.read_at && handleMarkRead(n.id)}
                    >
                      <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!n.read_at ? 'bg-primary' : 'bg-transparent'}`} />
                      <div className="flex-1 space-y-1 cursor-pointer">
                        <p className={`text-sm ${!n.read_at ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {n.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 pt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(n.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
