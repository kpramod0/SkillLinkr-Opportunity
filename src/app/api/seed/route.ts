import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = await createAdminClient()
  
  const categories = [
    { name: 'Hackathon', slug: 'hackathon', description: 'Coding competitions and hackathons' },
    { name: 'Workshop', slug: 'workshop', description: 'Skill-building workshops and training' },
    { name: 'Event', slug: 'event', description: 'Cultural, technical, or social events' },
    { name: 'Internship', slug: 'internship', description: 'Internship opportunities' },
    { name: 'Competition', slug: 'competition', description: 'General competitions (design, quiz, etc)' },
    { name: 'Seminar/Webinar', slug: 'seminar', description: 'Guest lectures and talks' },
  ]

  const { data, error } = await supabase
    .from('opp_categories')
    .upsert(categories, { onConflict: 'slug' })

  if (error) {
    return NextResponse.json({ success: false, error: error.message })
  }

  return NextResponse.json({ success: true, message: 'Categories seeded successfully' })
}
