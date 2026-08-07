import { createClient } from './supabase-server'

export type UserRole = 'super_admin' | 'admin' | 'ambassador' | 'society'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('opp_users')
    .select('role, status')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  return {
    ...user,
    role: profile.role as UserRole,
    status: profile.status
  }
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await getCurrentUser()
  
  if (!user || !allowedRoles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  
  return user
}

export async function getAmbassadorCollegeId(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('opp_ambassadors')
    .select('college_id')
    .eq('user_id', userId)
    .single()
    
  return data?.college_id
}

export async function getSocietyId(userId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('opp_societies')
    .select('id, college_id')
    .eq('user_id', userId)
    .single()
    
  return data
}
