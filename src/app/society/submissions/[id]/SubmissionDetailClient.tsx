"use client"

import { ArrowLeft, ExternalLink, Calendar, MapPin, Users, History, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SubmissionDetailClient({ opp, timeline }: { opp: any, timeline: any[] }) {
  const router = useRouter()
  
  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/society/submissions" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{opp.title}</h1>
            <p className="text-muted-foreground mt-1">Manage and track your submission.</p>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold uppercase tracking-wider">
            {opp.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-foreground">Event Details</h2>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Category</p>
                <p className="font-medium text-foreground">{opp.opp_categories?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Eligibility</p>
                <p className="font-medium text-foreground">{opp.eligibility || 'N/A'}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="font-bold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{opp.description}</p>
            </div>

            <hr className="border-border" />

            <div className="flex flex-wrap gap-6">
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground" suppressHydrationWarning>
                    {opp.event_starts ? new Date(opp.event_starts).toLocaleDateString() : 'TBD'} to {opp.event_ends ? new Date(opp.event_ends).toLocaleDateString() : 'TBD'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Location ({opp.mode})</p>
                  <p className="text-muted-foreground">{opp.venue || 'N/A'}</p>
                </div>
              </div>
              {opp.max_participants && (
                <div className="flex items-start gap-3 text-sm">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Capacity</p>
                    <p className="text-muted-foreground">{opp.max_participants} max</p>
                  </div>
                </div>
              )}
            </div>
            
            <hr className="border-border" />
            
            {opp.registration_link && (
              <div>
                <p className="text-muted-foreground text-sm mb-2">Registration Link</p>
                <a href={opp.registration_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm break-all">
                  {opp.registration_link} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Approval Timeline
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border pl-6">
              {timeline.map((event, index) => (
                <div key={event.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`w-3 h-3 rounded-full absolute -left-[1.35rem] top-1.5 ring-4 ring-background ${
                    index === timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground'
                  }`}></div>
                  
                  {/* Event Content */}
                  <div className="bg-muted/20 border p-4 rounded-xl shadow-sm text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="font-bold text-foreground capitalize">{event.status.replace(/_/g, ' ')}</span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap" suppressHydrationWarning>{new Date(event.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium mb-2">By {event.opp_users?.role || 'System'}</p>
                    {event.notes && (
                      <div className="bg-background border rounded-lg p-3 text-muted-foreground text-xs">
                        {event.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {timeline.length === 0 && (
                <p className="text-muted-foreground text-sm">No timeline events found.</p>
              )}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Actions</h3>
            {['submitted', 'under_review', 'correction_requested', 'correction_submitted', 'draft'].includes(opp.status) ? (
              <button 
                onClick={() => router.push('/society/new-opportunity')}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-primary text-primary hover:bg-primary/10 rounded-xl font-medium transition-colors"
              >
                Edit Submission
              </button>
            ) : (
              <p className="text-xs text-muted-foreground text-center">Editing is locked for {opp.status.replace(/_/g, ' ')} submissions.</p>
            )}
            <p className="text-[10px] text-muted-foreground text-center">Note: Full edit support coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
