'use server'

import { createClient } from '@/lib/supabase-server'

export type AuthContext = {
  user: any;
  role: string;
  userId: string;
  collegeId?: string;
  societyId?: string;
  ambassadorId?: string;
}

export async function requireAuth(): Promise<AuthContext> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    throw new Error('Unauthorized')
  }

  const { data: profile, error: profileError } = await supabase
    .from('opp_users')
    .select('role')
    .eq('id', user.id)
    .single()

  let role = profile?.role;

  if (profileError || !profile) {
    // If they aren't in opp_users yet, they might be in the onboarding phase.
    // Let's check their identity via email
    if (user.email) {
        const { resolveOmsIdentity } = await import('@/lib/role-resolver')
        const identity = await resolveOmsIdentity(user.email)
        if (identity.role === 'denied') {
            throw new Error('User profile not found and not eligible')
        }
        role = identity.role
    } else {
        throw new Error('User profile not found')
    }
  }

  // Remove const role = profile.role
  let collegeId: string | undefined
  let societyId: string | undefined
  let ambassadorId: string | undefined

  if (role === 'society') {
    const { data: society } = await supabase
      .from('opp_societies')
      .select('id, college_id')
      .eq('user_id', user.id)
      .single()
    
    if (society) {
      societyId = society.id
      collegeId = society.college_id
    }
  } else if (role === 'ambassador') {
    const { data: ambassador } = await supabase
      .from('opp_ambassadors')
      .select('id, college_id')
      .eq('user_id', user.id)
      .single()
      
    if (ambassador) {
      ambassadorId = ambassador.id
      collegeId = ambassador.college_id
    }
  }

  return {
    user,
    userId: user.id,
    role,
    collegeId,
    societyId,
    ambassadorId
  }
}
