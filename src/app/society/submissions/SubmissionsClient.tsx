"use client"

import { useState } from 'react'
import { Search, ExternalLink, Calendar, Users, MapPin, Eye, MousePointerClick } from 'lucide-react'
import Link from 'next/link'

export default function SubmissionsClient({ initialSubmissions }: { initialSubmissions: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Submissions</h1>
        <p className="text-muted-foreground mt-1">Track the status and performance of your published opportunities.</p>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search submissions by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {initialSubmissions.length === 0 ? (
           <div className="p-12 text-center text-muted-foreground border rounded-2xl border-dashed">
             You haven't submitted any opportunities yet.
           </div>
        ) : initialSubmissions.map((item) => (
          <div key={item.id} className="bg-card border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    item.status === 'published' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Submitted on {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {item.mode || 'N/A'}
                  </span>
                  {item.max_participants && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Capacity: {item.max_participants}
                    </span>
                  )}
                  {item.status === 'published' && (
                    <>
                      <span className="flex items-center gap-1.5 text-foreground font-medium border-l pl-4 ml-2">
                        <Eye className="h-4 w-4 text-primary" />
                        {item.view_count || 0} Views
                      </span>
                      <span className="flex items-center gap-1.5 text-foreground font-medium border-l pl-4">
                        <MousePointerClick className="h-4 w-4 text-primary" />
                        {item.reg_click_count || 0} Reg. Clicks
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link 
                  href={`/society/submissions/${item.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors border"
                >
                  View Details
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
