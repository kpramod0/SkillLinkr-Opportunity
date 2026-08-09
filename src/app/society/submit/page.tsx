import { requireAuth } from '@/app/actions/auth-helpers'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { SubmitClient } from './SubmitClient'

import { AccountConfigurationError } from '@/components/ui/AccountConfigurationError'

export default async function SubmissionWizardPage(props: { searchParams: Promise<{ id?: string }> }) {
  const searchParams = await props.searchParams;
  const auth = await requireAuth()
  if (auth.role !== 'society') {
    redirect('/')
  }
  if (!auth.societyId || !auth.collegeId) {
    return <AccountConfigurationError type="society" />
  }

  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from('opp_categories')
    .select('*')
    .order('name')

  let initialData = null;
  if (searchParams.id) {
    const { data: existingDraft } = await supabase
      .from('opp_opportunities')
      .select('*')
      .eq('id', searchParams.id)
      .eq('society_id', auth.societyId)
      .eq('status', 'draft')
      .single()
      
    if (existingDraft) {
      initialData = existingDraft
      // Format dates for datetime-local input
      if (initialData.event_starts) {
        initialData.event_starts = new Date(initialData.event_starts).toISOString().slice(0, 16)
      }
      if (initialData.event_ends) {
        initialData.event_ends = new Date(initialData.event_ends).toISOString().slice(0, 16)
      }
    }
  }

  return <SubmitClient categories={categories || []} initialData={initialData} />
}
