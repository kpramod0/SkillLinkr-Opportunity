import { AdminLayoutWrapper } from '@/components/layout/AdminLayoutWrapper'
import { createClient } from '@/lib/supabase-server'
import { requireAuth } from '@/app/actions/auth-helpers'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth()
  const supabase = await createClient()

  const { data: user } = await supabase.from('opp_users').select('name').eq('id', auth.userId).single()
  const userName = user?.name || 'Admin User'
  
  // Format role for display
  const roleDisplay = auth.role === 'super_admin' ? 'Super Admin' : 'Admin'

  return (
    <AdminLayoutWrapper userName={userName} role={roleDisplay}>
      {children}
    </AdminLayoutWrapper>
  )
}
