"use client"

import { BarChart3, TrendingUp, Users, Download } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into platform usage and opportunity metrics.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-medium hover:bg-primary/20 transition-colors">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-foreground">Total Engagement</h2>
          </div>
          <p className="text-3xl font-bold">145.2k</p>
          <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12.5% this month
          </p>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-foreground">Active Students</h2>
          </div>
          <p className="text-3xl font-bold">24,590</p>
          <p className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +5.2% this month
          </p>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h2 className="font-semibold text-foreground">Conversion Rate</h2>
          </div>
          <p className="text-3xl font-bold">18.4%</p>
          <p className="text-sm text-muted-foreground mt-1">View to Registration click</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Engagement by Category</h2>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground bg-muted/30 rounded-xl">
            Pie/Doughnut Chart Placeholder
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[400px]">
          <h2 className="text-lg font-bold text-foreground mb-4">Student Activity Trends</h2>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground bg-muted/30 rounded-xl">
            Line Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  )
}
