import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { HistoryClient } from './HistoryClient'
import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function AmbassadorHistoryPage() {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    redirect('/')
  }
  if (!auth.collegeId) {
    return <AccountConfigurationError type="ambassador" />
  }

  const supabase = await createClient()

  // Find all timeline entries where this ambassador was the actor
  const { data: timelineEntries } = await supabase
    .from('opp_submissions_timeline')
    .select('opportunity_id, status, created_at')
    .eq('actor_id', auth.userId)
    .order('created_at', { ascending: false })

  // Find all opportunities where this ambassador is currently marked as the verifier/approver
  // This acts as a fallback in case the timeline insert failed for older records
  const { data: verifiedOpps } = await supabase
    .from('opp_opportunities')
    .select(`
      id,
      title,
      status,
      updated_at,
      opp_societies ( society_name )
    `)
    .eq('verified_by', auth.userId)

  const uniqueOppIds = new Set<string>()
  if (timelineEntries) {
    timelineEntries.forEach(t => uniqueOppIds.add(t.opportunity_id))
  }
  if (verifiedOpps) {
    verifiedOpps.forEach(o => uniqueOppIds.add(o.id))
  }
  
  if (uniqueOppIds.size === 0) {
    return <HistoryClient history={[]} />
  }

  // Fetch all unique opportunities
  const { data: opps, error: oppsError } = await supabase
    .from('opp_opportunities')
    .select(`
      id,
      title,
      status,
      updated_at,
      opp_societies ( society_name )
    `)
    .in('id', Array.from(uniqueOppIds))

  if (oppsError || !opps) {
    return <HistoryClient history={[]} />
  }

  const historyMap = new Map()
  
  // First add all opportunities they are the current verifier for
  if (verifiedOpps) {
    for (const opp of verifiedOpps) {
      historyMap.set(opp.id, {
        id: opp.id,
        title: opp.title,
        society: opp.opp_societies?.society_name || 'Unknown Society',
        date: new Date(opp.updated_at).toISOString().split('T')[0],
        action: opp.status === 'published' ? 'Approved' : 
               opp.status === 'rejected' ? 'Rejected' : 
               opp.status === 'correction_requested' || opp.status === 'correction_submitted' ? 'Requested Correction' : 'Reviewed',
        status: opp.status,
        isFromVerifiedOpps: true
      })
    }
  }

  // Then overwrite with timeline entries if they exist (since they have more accurate historical action data)
  if (timelineEntries) {
    for (const entry of timelineEntries) {
      // Only keep the latest timeline entry per opportunity
      if (!historyMap.has(entry.opportunity_id) || historyMap.get(entry.opportunity_id).isFromVerifiedOpps) {
        const opp = opps.find(o => o.id === entry.opportunity_id)
        if (opp) {
          historyMap.set(entry.opportunity_id, {
            id: opp.id,
            title: opp.title,
            society: opp.opp_societies?.society_name || 'Unknown Society',
            date: new Date(entry.created_at).toISOString().split('T')[0],
            action: entry.status === 'published' ? 'Approved' : 
                   entry.status === 'rejected' ? 'Rejected' : 
                   entry.status === 'correction_requested' || entry.status === 'correction_submitted' ? 'Requested Correction' : 'Reviewed',
            status: opp.status
          })
        }
      }
    }
  }

  if (oppsError || !opps) {
    return <HistoryClient history={[]} />
  }

  const history = Array.from(historyMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return <HistoryClient history={history} />
}
