import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import SubmissionDetailClient from './SubmissionDetailClient'

export default async function SubmissionDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }

  const supabase = await createClient()

  // Fetch opportunity
  const { data: opp, error } = await supabase
    .from('opp_opportunities')
    .select(`
      *,
      opp_categories(name)
    `)
    .eq('id', params.id)
    .eq('society_id', auth.societyId!)
    .single()

  if (error || !opp) {
    redirect('/society/submissions')
  }

  // Fetch timeline
  const { data: timeline } = await supabase
    .from('opp_submissions_timeline')
    .select(`
      id,
      status,
      notes,
      created_at,
      actor_id,
      opp_users(role, email)
    `)
    .eq('opportunity_id', params.id)
    .order('created_at', { ascending: true })

  return <SubmissionDetailClient opp={opp} timeline={timeline || []} />
}
