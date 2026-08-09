import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SubmissionsClient from './SubmissionsClient'

export default async function SubmissionsPage() {
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }
  
  if (!auth.societyId) {
    redirect('/society/onboarding')
  }

  const supabase = await createClient()

  // Fetch opportunities submitted by this society
  const { data: submissions } = await supabase
    .from('opp_opportunities')
    .select('*')
    .eq('society_id', auth.societyId)
    .order('created_at', { ascending: false })

  return <SubmissionsClient initialSubmissions={submissions || []} />
}
