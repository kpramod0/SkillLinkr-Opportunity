import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const envPath = path.resolve(process.cwd(), '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const envVars = {}

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) {
    let key = match[1].trim()
    let val = match[2].trim()
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1)
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1)
    envVars[key] = val
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

async function run() {
  console.log('Starting delete and seed...')

  // Get all users
  const { data: { users }, error: listErr } = await supabase.auth.admin.listUsers()
  if (listErr) {
    console.error('Error listing users:', listErr)
    return
  }

  // Delete corrupted users
  for (const user of users) {
    if (user.email === '222s@kiit.ac.in' || user.email === '3333@kiit.ac.in') {
      console.log(`Deleting user ${user.email} (ID: ${user.id})...`)
      
      // Cleanup opp_societies and opp_users manually first just in case
      await supabase.from('opp_societies').delete().eq('user_id', user.id)
      await supabase.from('opp_users').delete().eq('id', user.id)
      
      const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
      if (delErr) {
        console.error(`Failed to delete ${user.email}:`, delErr)
      } else {
        console.log(`Successfully deleted ${user.email}`)
      }
    }
  }

  console.log('Creating clean users...')

  // Get college
  const { data: college } = await supabase.from('opp_colleges').select('id').eq('email_domain', 'kiit.ac.in').limit(1).maybeSingle()
  if (!college) {
    console.error("College not found for kiit.ac.in")
    return
  }

  // Create Society User
  console.log('Creating 222s@kiit.ac.in...')
  const { data: socAuth, error: socErr } = await supabase.auth.admin.createUser({
    email: '222s@kiit.ac.in',
    password: 'Password',
    email_confirm: true,
  })
  
  if (socErr) {
    console.error('Error creating 222s@kiit.ac.in:', socErr)
  } else if (socAuth.user) {
    await supabase.from('opp_users').insert({
      id: socAuth.user.id,
      email: '222s@kiit.ac.in',
      role: 'society',
      status: 'active',
      onboarding_completed: true
    })
    await supabase.from('opp_societies').insert({
      user_id: socAuth.user.id,
      college_id: college.id,
      society_name: 'Safe Society',
      representative_name: 'Test Rep',
      position: 'President'
    })
    console.log('Successfully created society user.')
  }

  // Create Ambassador User
  console.log('Creating 3333@kiit.ac.in...')
  const { data: ambAuth, error: ambErr } = await supabase.auth.admin.createUser({
    email: '3333@kiit.ac.in',
    password: 'Password',
    email_confirm: true,
  })

  if (ambErr) {
    console.error('Error creating 3333@kiit.ac.in:', ambErr)
  } else if (ambAuth.user) {
    await supabase.from('opp_users').insert({
      id: ambAuth.user.id,
      email: '3333@kiit.ac.in',
      role: 'ambassador',
      status: 'active',
      onboarding_completed: true
    })
    console.log('Successfully created ambassador user.')
  }

  console.log('Done!')
}

run()
