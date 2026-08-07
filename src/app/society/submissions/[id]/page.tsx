"use client"

import { ArrowLeft, ExternalLink, Calendar, MapPin, Users, History } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function SubmissionDetailPage() {
  const params = useParams()
  
  // Mock Opportunity Data
  const opp = {
    id: params.id as string,
    title: 'TechNova Workshop',
    society: 'Tech Society KIIT',
    category: 'Workshops',
    description: 'A 2-day intensive workshop on modern web technologies and cloud deployment.',
    mode: 'Online',
    venue: 'Google Meet',
    startDate: '2026-08-20',
    endDate: '2026-08-21',
    registrationLink: 'https://technova.example.com',
    maxParticipants: 100,
    eligibility: 'All students',
    status: 'correction_submitted', // Example status
  }

  // Mock Timeline Data
  const timeline = [
    { id: 1, status: 'submitted', date: '2026-08-01 10:00 AM', actor: 'Tech Society', notes: 'Initial submission' },
    { id: 2, status: 'under_review', date: '2026-08-01 02:30 PM', actor: 'System', notes: 'Assigned to reviewer' },
    { id: 3, status: 'needs_correction', date: '2026-08-02 11:15 AM', actor: 'Ambassador', notes: 'Please update the poster to include the SkillLinkr logo as per guidelines.' },
    { id: 4, status: 'correction_submitted', date: '2026-08-03 09:00 AM', actor: 'Tech Society', notes: 'Poster updated with logo.' },
  ]

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
            Correction Submitted
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
                <p className="font-medium text-foreground">{opp.category}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Eligibility</p>
                <p className="font-medium text-foreground">{opp.eligibility}</p>
              </div>
            </div>

            <hr className="border-border" />

            <div>
              <h3 className="font-bold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{opp.description}</p>
            </div>

            <hr className="border-border" />

            <div className="flex flex-wrap gap-6">
              <div className="flex items-start gap-3 text-sm">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Date</p>
                  <p className="text-muted-foreground">{opp.startDate} to {opp.endDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Location ({opp.mode})</p>
                  <p className="text-muted-foreground">{opp.venue}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Users className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Capacity</p>
                  <p className="text-muted-foreground">{opp.maxParticipants} max</p>
                </div>
              </div>
            </div>
            
            <hr className="border-border" />
            
            <div>
              <p className="text-muted-foreground text-sm mb-2">Registration Link</p>
              <a href={opp.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm">
                {opp.registrationLink} <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Timeline & Actions */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Approval Timeline
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent pl-4">
              {timeline.map((event, index) => (
                <div key={event.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className={`flex items-center justify-center w-4 h-4 rounded-full border-4 border-background absolute left-0 -ml-1 ${
                    index === timeline.length - 1 ? 'bg-primary' : 'bg-muted-foreground'
                  }`}></div>
                  
                  {/* Event Content */}
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] bg-muted/20 border p-4 rounded-xl shadow-sm ml-4 text-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-foreground capitalize">{event.status.replace(/_/g, ' ')}</span>
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium mb-2">By {event.actor}</p>
                    {event.notes && (
                      <div className="bg-background border rounded-lg p-3 text-muted-foreground">
                        {event.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Action buttons (e.g., Edit if correction requested) */}
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Actions</h3>
            <button className="flex items-center justify-center gap-2 w-full py-2.5 border border-primary text-primary hover:bg-primary/10 rounded-xl font-medium transition-colors">
              Edit Submission
            </button>
            <p className="text-xs text-muted-foreground text-center">You can edit the submission while it is under review or needs correction.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
