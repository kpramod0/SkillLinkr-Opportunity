"use client"

import { 
  Briefcase, 
  CheckCircle, 
  XCircle, 
  Globe, 
  Archive, 
  Users, 
  Building2, 
  Store
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export function DashboardClient({ stats, chartData, topColleges }: { stats: any, chartData: any[], topColleges: any[] }) {
  const statCards = [
    { label: 'Pending Opportunities', value: stats.pending || 0, icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Approved', value: stats.approved || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Rejected', value: stats.rejected || 0, icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Published (Live)', value: stats.published || 0, icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Submitted', value: stats.total || 0, icon: Archive, color: 'text-muted-foreground', bg: 'bg-muted' },
    { label: 'Active Ambassadors', value: stats.ambassadors || 0, icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Verified Societies', value: stats.societies || 0, icon: Store, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Onboarded Colleges', value: stats.colleges || 0, icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of the SkillLinkr Opportunities platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Opportunities Volume (Last 7 Days)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="count" name="Submissions" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Performing Colleges</h2>
          <div className="space-y-4">
            {topColleges.map((college, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-medium">{college.name}</p>
                    <p className="text-xs text-muted-foreground">{college.active_count} active opportunities</p>
                  </div>
                </div>
              </div>
            ))}
            {topColleges.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No data available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
