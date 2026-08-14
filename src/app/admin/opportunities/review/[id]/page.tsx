import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient, createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { ReviewClient } from './ReviewClient'
import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function ReviewOpportunityPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
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

  if (error || !opp) {
    redirect('/admin/opportunities')
  }

  const adminSupabase = await createAdminClient();
  const { data: image } = await adminSupabase
    .from('opp_opportunity_images')
    .select('*')
    .eq('opportunity_id', params.id)
    .limit(1)
    .single()

  return <ReviewClient opp={opp} image={image} />
}
