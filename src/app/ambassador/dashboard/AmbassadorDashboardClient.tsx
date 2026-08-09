"use client"

import { CheckSquare, Clock, CheckCircle, Ban, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function AmbassadorDashboardClient({ stats, recentActivity, chartData }: any) {
  const statCards = [
    { label: 'Pending Reviews', value: stats.pending, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Total Reviewed', value: stats.totalReviewed, icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Correction Requested / Rejected', value: stats.rejected, icon: Ban, color: 'text-red-500', bg: 'bg-red-500/10' },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Ambassador Dashboard</h1>
        <p className="text-muted-foreground mt-1">Manage society submissions for your college.</p>
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
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-foreground">Review Activity (Last 7 Days)</h2>
          </div>
          <div className="p-6 flex-1 w-full h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                 <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                 <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                 <Tooltip 
                   contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem' }}
                   itemStyle={{ color: 'hsl(var(--foreground))' }}
                 />
                 <Line type="monotone" dataKey="reviews" name="Reviews" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-foreground">Recent Timeline Activity</h2>
          </div>
          <div className="divide-y flex-1 overflow-auto">
            {recentActivity.length === 0 ? (
               <div className="p-8 text-center text-muted-foreground">No recent activity</div>
            ) : recentActivity.map((item: any) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {item.to_status === 'ready_for_publish' ? 'Approved' : 
                       item.to_status === 'rejected' ? 'Rejected' : 
                       item.to_status === 'needs_correction' ? 'Requested Correction for' : 
                       item.to_status}: &quot;{item.opp_opportunities?.title || 'Unknown'}&quot;
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(item.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
