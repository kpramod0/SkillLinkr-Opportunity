import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './DashboardClient'
import { subDays, format } from 'date-fns'

export default async function AdminDashboardPage() {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    redirect('/')
  }

  const supabase = await createClient()
  
  // Fetch real counts
  const [
    { count: pending },
    { count: approved },
    { count: rejected },
    { count: published },
    { count: total },
    { count: ambassadors },
    { count: societies },
    { count: colleges }
  ] = await Promise.all([
    supabase.from('opp_opportunities').select('*', { count: 'exact', head: true }).eq('status', 'under_review'),
    supabase.from('opp_opportunities').select('*', { count: 'exact', head: true }).eq('status', 'ready_for_publish'),
    supabase.from('opp_opportunities').select('*', { count: 'exact', head: true }).in('status', ['rejected', 'needs_correction']),
    supabase.from('opp_opportunities').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('opp_opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('opp_users').select('*', { count: 'exact', head: true }).eq('role', 'ambassador'),
    supabase.from('opp_users').select('*', { count: 'exact', head: true }).eq('role', 'society'),
    supabase.from('opp_colleges').select('*', { count: 'exact', head: true }),
  ])

  // Chart Data: Last 7 days submissions
  const sevenDaysAgo = subDays(new Date(), 7)
  const { data: recentSubmissions } = await supabase
    .from('opp_opportunities')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString())

  const chartDataMap = new Map()
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i)
    chartDataMap.set(format(d, 'MMM dd'), 0)
  }
  
  recentSubmissions?.forEach(sub => {
    const d = format(new Date(sub.created_at), 'MMM dd')
    if (chartDataMap.has(d)) {
      chartDataMap.set(d, chartDataMap.get(d) + 1)
    }
  })

  const chartData = Array.from(chartDataMap.entries()).map(([date, count]) => ({ date, count }))

  // Top Colleges
  const { data: topCollegesRaw } = await supabase
    .from('opp_opportunities')
    .select('college_id, opp_colleges(name)')
    .eq('status', 'published')

  const collegeCount: Record<string, {name: string, count: number}> = {}
  topCollegesRaw?.forEach(row => {
    if (row.college_id && row.opp_colleges) {
      if (!collegeCount[row.college_id]) {
        collegeCount[row.college_id] = { name: row.opp_colleges.name, count: 0 }
      }
      collegeCount[row.college_id].count++
    }
  })
  
  const topColleges = Object.values(collegeCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(c => ({ name: c.name, active_count: c.count }))

  const stats = { pending, approved, rejected, published, total, ambassadors, societies, colleges }

  return <DashboardClient stats={stats} chartData={chartData} topColleges={topColleges} />
}
