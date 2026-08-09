import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AmbassadorsClient } from './AmbassadorsClient'

export default async function AmbassadorsPage() {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
  }

  const supabase = await createClient()
  
  const { data: ambassadors, error } = await supabase
    .from('opp_users')
    .select(`
      *,
      opp_ambassadors(
        *,
        opp_colleges(name)
      )
    `)
    .eq('role', 'ambassador')
    .order('created_at', { ascending: false })

  const { data: colleges } = await supabase
    .from('opp_colleges')
    .select('*')
    .order('name')

  return <AmbassadorsClient ambassadors={ambassadors || []} colleges={colleges || []} />
}
