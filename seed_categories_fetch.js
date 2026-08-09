const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

async function seedCategories() {
  const categories = [
    { name: 'Events', slug: 'events', sort_order: 1 },
    { name: 'Hackathons', slug: 'hackathons', sort_order: 2 },
    { name: 'Internships', slug: 'internships', sort_order: 3 },
    { name: 'Recruitments', slug: 'recruitments', sort_order: 4 },
    { name: 'Competitions', slug: 'competitions', sort_order: 5 },
    { name: 'Research', slug: 'research', sort_order: 6 },
  ]

  // First, get all existing categories to delete them (optional, but good for cleanup)
  const getResponse = await fetch(`${supabaseUrl}/rest/v1/opp_categories?select=id`, {
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    }
  })
  
  if (getResponse.ok) {
    const existing = await getResponse.json()
    if (existing.length > 0) {
      const ids = existing.map(e => e.id).join(',')
      await fetch(`${supabaseUrl}/rest/v1/opp_categories?id=in.(${ids})`, {
        method: 'DELETE',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        }
      })
    }
  }

  // Insert the new ones
  const response = await fetch(`${supabaseUrl}/rest/v1/opp_categories`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(categories)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Error seeding categories:', errorText)
  } else {
    console.log('Categories seeded successfully!')
  }
}

seedCategories()
