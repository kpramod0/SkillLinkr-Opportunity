import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createAdminClient()

  try {
    // 1. Create Society User
    const { data: college } = await supabase.from('opp_colleges').select('id').eq('email_domain', 'kiit.ac.in').limit(1).maybeSingle()
    if (!college) throw new Error("College not found")

    const { data: socAuth, error: socErr } = await supabase.auth.admin.createUser({
      email: '222s@kiit.ac.in',
      password: 'Password',
      email_confirm: true,
    })
    
    if (socErr) throw new Error("Society Auth Error: " + socErr.message)
    
    if (socAuth.user) {
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
    }

    // 2. Create Ambassador User
    const { data: ambAuth, error: ambErr } = await supabase.auth.admin.createUser({
      email: '3333@kiit.ac.in',
      password: 'Password',
      email_confirm: true,
    })
    
    if (ambErr) throw new Error("Ambassador Auth Error: " + ambErr.message)

    if (ambAuth.user) {
      await supabase.from('opp_users').insert({
        id: ambAuth.user.id,
        email: '3333@kiit.ac.in',
        role: 'ambassador',
        status: 'active',
        onboarding_completed: true
      })
    }

    return NextResponse.json({ success: true, message: "Users seeded safely!" })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
