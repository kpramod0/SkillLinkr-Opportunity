import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seedCategories() {
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
    console.error('Error seeding categories:', error)
  } else {
    console.log('Categories seeded successfully!')
  }
}

seedCategories()
