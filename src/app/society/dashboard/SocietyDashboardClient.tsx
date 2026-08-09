"use client"

import { PlusCircle, FileText, CheckCircle, Clock, Eye, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SocietyDashboardClient({ opps, submissions, drafts, totalSubmissions, published, totalViews, totalRegs, chartData }: any) {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome to your Dashboard</h1>
          <p className="text-muted-foreground mt-1">Publish and manage opportunities for students across India.</p>
        </div>
        <Link 
          href="/society/submit"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          Create Opportunity
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Submissions</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalSubmissions}</p>
          </div>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Published</p>
            <p className="text-2xl font-bold text-foreground mt-1">{published}</p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Eye className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalViews}</p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <MousePointerClick className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
            <p className="text-2xl font-bold text-foreground mt-1">{totalRegs}</p>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm min-h-[350px]">
        <h2 className="text-lg font-bold text-foreground mb-4">Views & Interactions (Last 7 Days)</h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '0.75rem' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line type="monotone" dataKey="views" name="Views" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="clicks" name="Reg. Clicks" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b flex justify-between items-center bg-muted/10">
            <h2 className="font-bold text-foreground">Recent Submissions</h2>
            <Link href="/society/submissions" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y flex-1 overflow-auto max-h-[400px]">
            {submissions.length === 0 ? (
               <div className="p-8 text-center text-muted-foreground">No submissions yet</div>
            ) : submissions.slice(0, 5).map((item: any) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(item.updated_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                  item.status === 'published' || item.status === 'live' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {item.status.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b flex justify-between items-center bg-muted/10">
            <h2 className="font-bold text-foreground">Drafts</h2>
          </div>
          <div className="p-6 flex-1 overflow-auto max-h-[400px] space-y-4">
            {drafts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No active drafts</div>
            ) : drafts.map((draft: any) => (
              <div key={draft.id} className="p-4 border border-dashed rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors">
                <div>
                  <p className="font-medium">{draft.title || 'Untitled Draft'}</p>
                  <p className="text-sm text-muted-foreground mt-1">Saved {new Date(draft.updated_at).toLocaleDateString()}</p>
                </div>
                <Link href={`/society/submit?id=${draft.id}`} className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg text-sm text-center">
                  Resume
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
