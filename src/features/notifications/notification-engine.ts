import { createAdminClient } from '@/lib/supabase-server'

export type NotificationChannel = 'in_app' | 'email' | 'push' | 'whatsapp'

export async function sendNotification({
  recipientId,
  type,
  title,
  body,
  channels = ['in_app'],
  metadata = {}
}: {
  recipientId: string
  type: string
  title: string
  body: string
  channels?: NotificationChannel[]
  metadata?: Record<string, unknown>
}) {
  try {
    const supabase = await createAdminClient()
    
    // In-app notification
    if (channels.includes('in_app')) {
      await supabase.from('opp_notifications').insert({
        recipient_id: recipientId,
        type,
        channel: 'in_app',
        title,
        body,
        metadata
      })
    }
    
    // External channels would integrate with Resend, Twilio, Firebase, etc.
    if (channels.includes('email')) {
      // await sendEmail(recipientEmail, title, body)
      console.log(`Sending email to ${recipientId}: ${title}`)
    }
    
    return true
  } catch (error: unknown) {
    console.error('Failed to send notification:', error)
    return false
  }
}
