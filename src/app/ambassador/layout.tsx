import { AmbassadorLayoutWrapper } from '@/components/layout/AmbassadorLayoutWrapper'
import { createClient } from '@/lib/supabase-server'
import { requireAuth } from '@/app/actions/auth-helpers'

export default async function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireAuth()
  const supabase = await createClient()

  const { data: amb } = await supabase.from('opp_ambassadors').select('full_name, is_society_member, opp_colleges(name)').eq('user_id', auth.userId).single()
  const isSocietyMember = amb?.is_society_member || false
  
  const userName = amb?.full_name || 'Ambassador'
  const collegeName = amb?.opp_colleges?.name || 'University'

  // Fetch count of pending reviews for the ambassador's college
  let pendingReviewsCount = 0
  if (auth.collegeId) {
    const { count } = await supabase
      .from('opp_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('college_id', auth.collegeId)
      .in('status', ['submitted', 'correction_submitted', 'under_review'])
    
    pendingReviewsCount = count || 0
  }

  return (
    <AmbassadorLayoutWrapper 
      isSocietyMember={isSocietyMember} 
      userName={userName} 
      collegeName={collegeName} 
      pendingReviewsCount={pendingReviewsCount}
    >
      {children}
    </AmbassadorLayoutWrapper>
  )
}
