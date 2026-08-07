"use client"

import { useState } from 'react'
import { ArrowLeft, CheckCircle, Ban, MessageSquare, AlertTriangle, ExternalLink, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function ReviewOpportunityPage() {
  const params = useParams()
  const [feedback, setFeedback] = useState('')
  
  // Mock Opportunity Data
  const opp = {
    id: params.id as string,
    title: 'KIIT Hackathon 2026',
    society: 'Tech Society KIIT',
    category: 'Hackathons',
    description: 'A 48-hour national level hackathon focused on solving real-world problems using AI and Web3 technologies.',
    mode: 'Hybrid',
    venue: 'Campus 15, KIIT University',
    startDate: '2026-10-15',
    endDate: '2026-10-17',
    registrationLink: 'https://hackathon.kiit.ac.in',
    maxParticipants: 500,
    eligibility: 'All B.Tech students',
    posterUrl: '/placeholder.svg' // Placeholder for UI
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/ambassador/queue" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Queue
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Submission</h1>
            <p className="text-muted-foreground mt-1">Reviewing: <span className="font-medium text-foreground">{opp.title}</span></p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider">
            Under Review
          </span>
        </div>
      </div>

      {/* Duplicate Detection Alert */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3 text-amber-600 dark:text-amber-500">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-sm">Potential Duplicates Found</h3>
          <p className="text-sm mt-1">Our system detected 1 similar event published by this society in the same timeframe. Please verify this is a unique event.</p>
          <button className="mt-2 text-sm font-bold underline hover:no-underline">View Similar Event</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Event Details</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Title</p>
                  <p className="font-medium text-foreground">{opp.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Society / Organizer</p>
                  <p className="font-medium text-foreground">{opp.society}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-medium text-foreground">{opp.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Eligibility</p>
                  <p className="font-medium text-foreground">{opp.eligibility}</p>
                </div>
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

        {/* Right Column: Actions & Poster */}
        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Poster Preview</h3>
            <div className="aspect-[4/5] bg-muted rounded-xl flex items-center justify-center border overflow-hidden">
              <p className="text-muted-foreground text-sm">Poster Image Displayed Here</p>
            </div>
          </div>

          <div className="bg-card border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-foreground">Review Actions</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Feedback / Correction Notes</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none min-h-[100px] resize-none"
                placeholder="Leave feedback if corrections are needed..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors">
                <CheckCircle className="h-4 w-4" />
                Approve & Mark Ready
              </button>
              <button 
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors"
                disabled={!feedback}
                title={!feedback ? "Please provide feedback before requesting corrections" : ""}
              >
                <MessageSquare className="h-4 w-4" />
                Request Corrections
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2.5 border hover:bg-muted/50 rounded-xl font-medium text-muted-foreground transition-colors">
                <Ban className="h-4 w-4" />
                Reject Submission
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
