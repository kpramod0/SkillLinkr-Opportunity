import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, ArrowRight, Clock, PlusCircle } from 'lucide-react'

export default async function SocietyDraftsPage() {
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }

  const supabase = await createClient()

  const { data: drafts } = await supabase
    .from('opp_opportunities')
    .select('id, title, updated_at')
    .eq('society_id', auth.societyId!)
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <FileText className="h-8 w-8 text-primary" />
            My Drafts
          </h1>
          <p className="text-muted-foreground mt-1">Opportunities you've started but haven't submitted for review.</p>
        </div>
        <Link 
          href="/society/submit"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <PlusCircle className="h-4 w-4" />
          New Opportunity
        </Link>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        {(!drafts || drafts.length === 0) ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No active drafts</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">You don't have any saved drafts. Start creating a new opportunity and you can save your progress at any time.</p>
            <Link 
              href="/society/submit"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Start Creating
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drafts.map((draft) => (
              <div key={draft.id} className="p-6 border border-dashed rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-colors group relative flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{draft.title || 'Untitled Draft'}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                    <Clock className="h-4 w-4" />
                    Last saved on {new Date(draft.updated_at).toLocaleDateString()} at {new Date(draft.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                <Link 
                  href={`/society/submit?id=${draft.id}`}
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-xl font-medium transition-colors"
                >
                  Resume Draft <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
