import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ReviewClient } from './ReviewClient'
import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function ReviewOpportunityPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    redirect('/')
  }
  if (!auth.collegeId) {
    return <AccountConfigurationError type="ambassador" />
  }

  const supabase = await createClient()
  
  const { data: opp, error } = await supabase
    .from('opp_opportunities')
    .select(`
      *,
      opp_categories(name)
    `)
    .eq('id', params.id)
    .single()

  if (error || !opp || opp.college_id !== auth.collegeId) {
    redirect('/ambassador/queue')
  }

  const { data: image } = await supabase
    .from('opp_opportunity_images')
    .select('*')
    .eq('opportunity_id', params.id)
    .limit(1)
    .single()

  return <ReviewClient opp={opp} image={image} />
}
