import { Search, ExternalLink, Calendar, Users, MapPin } from 'lucide-react'
import Link from 'next/link'
import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function ReviewQueuePage() {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    redirect('/')
  }
  if (!auth.collegeId) {
    return <AccountConfigurationError type="ambassador" />
  }

  const supabase = await createClient()

  // Fetch submitted or needs_correction opportunities for their college
  const { data: queue, error } = await supabase
    .from('opp_opportunities')
    .select(`
      *,
      opp_societies (
        id,
        user_id
      )
    `)
    .eq('college_id', auth.collegeId)
    .in('status', ['submitted', 'correction_submitted', 'under_review'])
    .order('updated_at', { ascending: false })

  const items = queue || []

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Queue</h1>
        <p className="text-muted-foreground mt-1">Review and approve new opportunities submitted by societies in your college.</p>
      </div>

      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search submissions by title or society..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.length === 0 ? (
           <div className="p-12 text-center text-muted-foreground border rounded-2xl border-dashed">
             No pending reviews for your college.
           </div>
        ) : items.map((item) => (
          <div key={item.id} className="bg-card border rounded-2xl p-6 shadow-sm hover:border-primary/50 transition-colors">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    item.status === 'correction_submitted' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {item.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                <p className="text-primary font-medium">{item.organizer}</p>
                
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {item.mode}
                  </span>
                  {item.max_participants && (
                    <span className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      Max {item.max_participants} participants
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <Link 
                  href={`/ambassador/review/${item.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Start Review
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
