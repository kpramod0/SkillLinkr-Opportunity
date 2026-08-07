"use client"

import { PlusCircle, FileText, CheckCircle, Clock, Eye, MousePointerClick } from 'lucide-react'
import Link from 'next/link'

export default function SocietyDashboardPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome, Tech Society</h1>
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
            <p className="text-2xl font-bold text-foreground mt-1">12</p>
          </div>
        </div>
        
        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-emerald-500/10">
            <CheckCircle className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Published</p>
            <p className="text-2xl font-bold text-foreground mt-1">8</p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-purple-500/10">
            <Eye className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Views</p>
            <p className="text-2xl font-bold text-foreground mt-1">4.5k</p>
          </div>
        </div>

        <div className="bg-card border rounded-2xl p-6 shadow-sm flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10">
            <MousePointerClick className="h-6 w-6 text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Registrations</p>
            <p className="text-2xl font-bold text-foreground mt-1">850</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-muted/10">
            <h2 className="font-bold text-foreground">Recent Submissions</h2>
            <Link href="/society/submissions" className="text-sm font-medium text-primary hover:underline">View All</Link>
          </div>
          <div className="divide-y">
            {[
              { title: 'TechNova Workshop', status: 'under_review', time: '2 hours ago' },
              { title: 'CodeSprint 2026', status: 'published', time: '5 days ago' },
            ].map((item, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                <div>
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                  item.status === 'published' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-muted/10">
            <h2 className="font-bold text-foreground">Drafts</h2>
          </div>
          <div className="p-6">
            <div className="p-4 border border-dashed rounded-xl flex items-center justify-between hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors">
              <div>
                <p className="font-medium">Web3 Builders Hackathon</p>
                <p className="text-sm text-muted-foreground mt-1">Step 2: Opportunity Details • Saved 10 mins ago</p>
              </div>
              <button className="px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg text-sm">
                Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
