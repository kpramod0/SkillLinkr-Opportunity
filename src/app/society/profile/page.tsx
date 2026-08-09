import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ProfileClient } from './ProfileClient'
import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function SocietyProfilePage() {
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }
  if (!auth.societyId || !auth.collegeId) {
    return <AccountConfigurationError type="society" />
  }

  const supabase = await createClient()

  // Fetch society profile details with the college name
  const { data: society, error } = await supabase
    .from('opp_societies')
    .select(`
      society_name,
      representative_name,
      contact_number,
      position,
      is_verified,
      created_at,
      opp_colleges ( name )
    `)
    .eq('id', auth.societyId)
    .single()

  if (error || !society) {
    redirect('/society/dashboard')
  }

  // Format data for client
  const profileData = {
    society_name: society.society_name,
    representative_name: society.representative_name,
    contact_number: society.contact_number || '',
    position: society.position || '',
    college_name: (Array.isArray(society.opp_colleges) ? society.opp_colleges[0]?.name : (society.opp_colleges as any)?.name) || 'Unknown College',
    is_verified: society.is_verified,
    created_at: society.created_at
  }

  return <ProfileClient profileData={profileData} />
}
