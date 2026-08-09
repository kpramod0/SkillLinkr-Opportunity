import { SocietyLayoutWrapper } from '@/components/layout/SocietyLayoutWrapper'
import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'

export default async function SocietyLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth()
  const supabase = await createClient()

  let userName = 'Society'
  let collegeName = 'University'

  if (auth.societyId) {
    const { data: soc } = await supabase
      .from('opp_societies')
      .select('society_name, opp_colleges(name)')
      .eq('id', auth.societyId)
      .single()
      
    if (soc) {
      userName = soc.society_name
      collegeName = soc.opp_colleges?.name || collegeName
    }
  }

  return (
    <SocietyLayoutWrapper userName={userName} collegeName={collegeName}>
      {children}
    </SocietyLayoutWrapper>
  )
}
