"use server"

import { createClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'

export async function getNotifications() {
  const auth = await requireAuth()
  if (!auth.userId) return []

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opp_notifications')
    .select('*')
    .eq('recipient_id', auth.userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching notifications:', error)
    return []
  }

  return data
}

export async function markNotificationRead(id: string) {
  const auth = await requireAuth()
  if (!auth.userId) throw new Error('Unauthorized')

  const supabase = await createClient()
  await supabase
    .from('opp_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
    .eq('recipient_id', auth.userId)
}

export async function markAllNotificationsRead() {
  const auth = await requireAuth()
  if (!auth.userId) throw new Error('Unauthorized')

  const supabase = await createClient()
  await supabase
    .from('opp_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', auth.userId)
    .is('read_at', null)
}
