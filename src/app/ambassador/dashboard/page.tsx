"use client"

import { CheckSquare, Clock, CheckCircle, Ban } from 'lucide-react'

const statCards = [
  { label: 'Pending Reviews', value: '3', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { label: 'Total Reviewed', value: '45', icon: CheckSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Approved', value: '40', icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Correction Requested', value: '5', icon: Ban, color: 'text-red-500', bg: 'bg-red-500/10' },
]

export default function AmbassadorDashboardPage() {
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

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-foreground">Recent Activity</h2>
        </div>
        <div className="divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Approved: &quot;TechNova Hackathon&quot;</p>
                <p className="text-sm text-muted-foreground mt-1">Submitted by Tech Society • 2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">
                Ready For Publish
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
