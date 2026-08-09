import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SocietiesClient } from './SocietiesClient'

export default async function SocietiesPage() {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
  }

  const supabase = await createClient()
  
  const { data: societies, error } = await supabase
    .from('opp_users')
    .select(`
      *,
      opp_societies(
        *,
        opp_colleges(name)
      )
    `)
    .eq('role', 'society')
    .order('created_at', { ascending: false })

  const { data: colleges } = await supabase
    .from('opp_colleges')
    .select('*')
    .order('name')

  return <SocietiesClient societies={societies || []} colleges={colleges || []} />
}
