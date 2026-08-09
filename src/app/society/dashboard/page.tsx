import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SocietyDashboardClient } from './SocietyDashboardClient'
import { subDays, format } from 'date-fns'

import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function SocietyDashboardPage() {
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }
  
  if (!auth.collegeId || !auth.societyId) {
    return <AccountConfigurationError type="society" />
  }

  const supabase = await createClient()
  
  const { data: opportunities, error } = await supabase
    .from('opp_opportunities')
    .select('*')
    .eq('society_id', auth.societyId)
    .order('updated_at', { ascending: false })

  const opps = opportunities || []
  const oppIds = opps.map(o => o.id)
  
  const drafts = opps.filter(o => o.status === 'draft')
  const submissions = opps.filter(o => o.status !== 'draft')
  
  const totalSubmissions = submissions.length
  const published = submissions.filter(o => o.status === 'published' || o.status === 'live').length
  const totalViews = opps.reduce((sum, o) => sum + (o.view_count || 0), 0)
  const totalRegs = opps.reduce((sum, o) => sum + (o.reg_click_count || 0), 0)

  // Chart Data: Last 7 days interactions
  const chartDataMap = new Map()
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    chartDataMap.set(format(d, 'MMM dd'), { date: format(d, 'MMM dd'), views: 0, clicks: 0 })
  }

  if (oppIds.length > 0) {
    const sevenDaysAgo = subDays(new Date(), 7).toISOString()
    const { data: interactions } = await supabase
      .from('opp_interactions')
      .select('type, created_at')
      .in('opportunity_id', oppIds)
      .gte('created_at', sevenDaysAgo)
      
    interactions?.forEach(interaction => {
      const d = format(new Date(interaction.created_at), 'MMM dd')
      if (chartDataMap.has(d)) {
        const item = chartDataMap.get(d)
        if (interaction.type === 'view') item.views++
        if (interaction.type === 'reg_click') item.clicks++
      }
    })
  }

  const chartData = Array.from(chartDataMap.values())

  return (
    <SocietyDashboardClient 
      opps={opps} 
      submissions={submissions} 
      drafts={drafts} 
      totalSubmissions={totalSubmissions} 
      published={published} 
      totalViews={totalViews} 
      totalRegs={totalRegs} 
      chartData={chartData} 
    />
  )
}
