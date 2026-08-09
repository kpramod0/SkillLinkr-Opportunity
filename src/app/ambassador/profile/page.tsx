import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'
import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function AmbassadorProfilePage() {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    redirect('/')
  }
  if (!auth.ambassadorId || !auth.collegeId) {
    return <AccountConfigurationError type="ambassador" />
  }

  const supabase = await createClient()

  // Fetch ambassador profile details with the college name
  const { data: ambassador, error } = await supabase
    .from('opp_ambassadors')
    .select(`
      full_name,
      department,
      year,
      contact_number,
      created_at,
      opp_colleges ( name )
    `)
    .eq('id', auth.ambassadorId)
    .single()

  if (error || !ambassador) {
    redirect('/ambassador/dashboard')
  }

  // Format data for client
  const profileData = {
    full_name: ambassador.full_name,
    department: ambassador.department || '',
    year: ambassador.year || new Date().getFullYear(),
    contact_number: ambassador.contact_number || '',
    college_name: (Array.isArray(ambassador.opp_colleges) ? ambassador.opp_colleges[0]?.name : (ambassador.opp_colleges as any)?.name) || 'Unknown College',
    created_at: ambassador.created_at
  }

  return <ProfileClient profileData={profileData} />
}
