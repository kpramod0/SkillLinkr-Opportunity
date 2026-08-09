import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { OpportunitiesClient } from './OpportunitiesClient'

export default async function OpportunitiesManagementPage() {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
  }

  const supabase = await createClient()
  
  const { data: opportunities, error } = await supabase
    .from('opp_opportunities')
    .select(`
      *,
      opp_categories(name),
      opp_colleges(name)
    `)
    .order('updated_at', { ascending: false })

  return <OpportunitiesClient opportunities={opportunities || []} />
}

