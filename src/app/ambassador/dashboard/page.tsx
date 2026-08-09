import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { AmbassadorDashboardClient } from './AmbassadorDashboardClient'
import { subDays, format } from 'date-fns'

import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function AmbassadorDashboardPage() {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    redirect('/')
  }
  
  if (!auth.collegeId) {
    return <AccountConfigurationError type="ambassador" />
  }

  const supabase = await createClient()
  
  const { data: opportunities } = await supabase
    .from('opp_opportunities')
    .select('id, status')
    .eq('college_id', auth.collegeId)
    
  const opps = opportunities || []
  
  const pending = opps.filter(o => o.status === 'submitted' || o.status === 'correction_submitted').length
  const approved = opps.filter(o => o.status === 'ready_for_publish' || o.status === 'published').length
  const rejected = opps.filter(o => o.status === 'rejected' || o.status === 'needs_correction').length
  const totalReviewed = approved + rejected

  const stats = { pending, totalReviewed, approved, rejected }

  // Activity Timeline
  const { data: recentActivity } = await supabase
    .from('opp_submissions_timeline')
    .select('id, to_status, created_at, opp_opportunities(title)')
    .eq('actor_id', auth.userId)
    .order('created_at', { ascending: false })
    .limit(10)

  // Chart Data: Last 7 days reviews
  const chartDataMap = new Map()
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    chartDataMap.set(format(d, 'MMM dd'), { date: format(d, 'MMM dd'), reviews: 0 })
  }

  const sevenDaysAgo = subDays(new Date(), 7).toISOString()
  const { data: timelineData } = await supabase
    .from('opp_submissions_timeline')
    .select('created_at')
    .eq('actor_id', auth.userId)
    .in('to_status', ['ready_for_publish', 'rejected', 'needs_correction'])
    .gte('created_at', sevenDaysAgo)

  timelineData?.forEach(item => {
    const d = format(new Date(item.created_at), 'MMM dd')
    if (chartDataMap.has(d)) {
      chartDataMap.get(d).reviews++
    }
  })

  const chartData = Array.from(chartDataMap.values())

  return (
    <AmbassadorDashboardClient 
      stats={stats} 
      recentActivity={recentActivity || []} 
      chartData={chartData} 
    />
  )
}
