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

const statCards = [
  { label: 'Pending Opportunities', value: '42', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Approved', value: '1,204', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Rejected', value: '89', icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  { label: 'Published (Live)', value: '856', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Archived', value: '3,210', icon: Archive, color: 'text-muted-foreground', bg: 'bg-muted' },
  { label: 'Active Ambassadors', value: '45', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Verified Societies', value: '128', icon: Store, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { label: 'Onboarded Colleges', value: '48', icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
]

export default function AdminDashboardPage() {
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
          <h2 className="text-lg font-bold text-foreground mb-4">Opportunities Volume (Last 30 Days)</h2>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground bg-muted/30 rounded-xl">
            Chart Placeholder
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Top Performing Colleges</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {i}
                  </div>
                  <div>
                    <p className="font-medium">KIIT University</p>
                    <p className="text-xs text-muted-foreground">42 active opportunities</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">12.4k</p>
                  <p className="text-xs text-muted-foreground">Views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
