"use client"

import { useState } from 'react'
import { ArrowLeft, CheckCircle, Ban, MessageSquare, AlertTriangle, ExternalLink, Calendar, MapPin, Users } from 'lucide-react'
import Link from 'next/link'
import { reviewOpportunity } from '@/app/actions/opportunities'
import { useRouter } from 'next/navigation'

export function ReviewClient({ opp, image }: { opp: any, image: any }) {
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReview = async (action: 'approve' | 'reject' | 'request_correction') => {
    setLoading(true)
    try {
      await reviewOpportunity(opp.id, action, feedback)
      router.push('/admin/opportunities')
    } catch (err: any) {
      alert(err.message || 'Failed to review')
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/admin/opportunities" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Opportunities
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Submission</h1>
            <p className="text-muted-foreground mt-1">Reviewing: <span className="font-medium text-foreground">{opp.title}</span></p>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold uppercase tracking-wider">
            {opp.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <p className="text-muted-foreground mb-1">Organizer</p>
                  <p className="font-medium text-foreground">{opp.organizer}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Category</p>
                  <p className="font-medium text-foreground">{opp.opp_categories?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Eligibility</p>
                  <p className="font-medium text-foreground">{opp.eligibility || 'N/A'}</p>
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
                  <p className="text-muted-foreground">{opp.event_starts ? new Date(opp.event_starts).toLocaleDateString() : 'TBD'} to {opp.event_ends ? new Date(opp.event_ends).toLocaleDateString() : 'TBD'}</p>
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

        <div className="space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-foreground mb-4">Poster Preview</h3>
            <div className="aspect-[4/5] bg-muted rounded-xl flex items-center justify-center border overflow-hidden">
              {image?.medium_url ? (
                <img src={image.medium_url} alt="Poster" className="w-full h-full object-cover" />
              ) : (
                <p className="text-muted-foreground text-sm">No image uploaded</p>
              )}
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
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-3 mt-4">
              <button 
                onClick={() => handleReview('approve')}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                Approve & Mark Ready
              </button>
              <button 
                onClick={() => handleReview('request_correction')}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl font-medium transition-colors disabled:opacity-50"
                disabled={!feedback || loading}
                title={!feedback ? "Please provide feedback before requesting corrections" : ""}
              >
                <MessageSquare className="h-4 w-4" />
                Request Corrections
              </button>
              <button 
                onClick={() => handleReview('reject')}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-2.5 border hover:bg-muted/50 rounded-xl font-medium text-muted-foreground transition-colors disabled:opacity-50"
              >
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
