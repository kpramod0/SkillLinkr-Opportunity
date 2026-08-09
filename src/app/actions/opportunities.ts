'use server'

import { createClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'
import { revalidatePath } from 'next/cache'

export async function createOpportunity(data: any, isSubmit: boolean = false) {
  const auth = await requireAuth()
  if (auth.role !== 'society' && auth.role !== 'ambassador') {
    throw new Error('Only societies and eligible ambassadors can create opportunities')
  }

  const supabase = await createClient()
  
  const { imageUrls, ...restData } = data

  let society_id = null;
  let college_id = null;

  if (auth.role === 'society') {
    // get society details
    const { data: soc } = await supabase.from('opp_societies').select('id, college_id').eq('user_id', auth.userId).single()
    if (!soc) throw new Error('Society profile not found')
    society_id = soc.id
    college_id = soc.college_id
  } else if (auth.role === 'ambassador') {
    // get ambassador details to see if they are a society member
    const { data: amb } = await supabase.from('opp_ambassadors').select('college_id, is_society_member').eq('user_id', auth.userId).single()
    if (!amb || !amb.is_society_member) throw new Error('You must be a society member to create opportunities')
    college_id = amb.college_id
    // society_id remains null or you can create a placeholder logic, but usually it's tied to their profile
  }

  const oppData = {
    ...restData,
    society_id,
    college_id,
    status: isSubmit ? 'submitted' : 'draft',
    current_version: 1
  }

  let opportunityId = restData.id;
  delete oppData.id;

  if (opportunityId) {
    const { data: existing } = await supabase.from('opp_opportunities').select('society_id, status').eq('id', opportunityId).single()
    if (!existing || existing.society_id !== society_id) throw new Error('Unauthorized or not found')
    
    const { error } = await supabase.from('opp_opportunities').update(oppData).eq('id', opportunityId)
    if (error) throw new Error(error.message)
  } else {
    const { data: newOpp, error } = await supabase
      .from('opp_opportunities')
      .insert(oppData)
      .select('id')
      .single()
    if (error) throw new Error(error.message)
    opportunityId = newOpp.id;
  }

  if (error) {
    throw new Error(error.message)
  }
  
  if (imageUrls && imageUrls.medium) {
    await supabase.from('opp_opportunity_images').insert({
      opportunity_id: opportunityId,
      thumbnail_url: imageUrls.thumbnail,
      medium_url: imageUrls.medium,
      large_url: imageUrls.large,
      variant: 'poster'
    })
  }

  if (isSubmit) {
    await supabase.from('opp_submissions_timeline').insert({
      opportunity_id: opportunityId,
      status: 'submitted',
      actor_id: auth.userId,
      notes: 'Initial submission by society'
    })
  }

  revalidatePath('/society/dashboard')
  revalidatePath('/society/submissions')
  revalidatePath('/society/drafts')
  
  return { success: true, id: opportunityId }
}

export async function reviewOpportunity(opportunityId: string, action: 'approve' | 'reject' | 'request_correction', notes?: string) {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador') {
    throw new Error('Only ambassadors can review opportunities')
  }

  const supabase = await createClient()

  // Verify the opportunity belongs to the ambassador's college
  const { data: opp, error: oppError } = await supabase
    .from('opp_opportunities')
    .select('id, college_id, society_id, title, status')
    .eq('id', opportunityId)
    .single()

  if (oppError || !opp) throw new Error('Opportunity not found')
  
  const { data: amb } = await supabase.from('opp_ambassadors').select('college_id').eq('user_id', auth.userId).single()
  if (!amb || opp.college_id !== amb.college_id) throw new Error('Unauthorized for this college')

  let newStatus = ''
  let notifTitle = ''
  let notifBody = ''
  switch (action) {
    case 'approve': 
      newStatus = 'published'; 
      notifTitle = 'Opportunity Published! 🎉'
      notifBody = `Great news! Your opportunity "${opp.title}" has been approved by your Campus Ambassador and is now live.`
      break;
    case 'reject': 
      newStatus = 'rejected'; 
      notifTitle = 'Opportunity Rejected'
      notifBody = `Your opportunity "${opp.title}" was rejected by your Campus Ambassador.`
      break;
    case 'request_correction': 
      newStatus = 'correction_requested'; 
      notifTitle = 'Correction Requested'
      notifBody = `Your Campus Ambassador requested corrections for "${opp.title}". Notes: ${notes}`
      break;
  }

  // Validate state transition using state-machine (optional extra safety)
  const { validateTransition } = await import('@/lib/state-machine')
  if (!validateTransition(opp.status as any, newStatus as any, auth.role)) {
    throw new Error(`Invalid state transition from ${opp.status} to ${newStatus}`)
  }

  const { error: updateError } = await supabase
    .from('opp_opportunities')
    .update({ 
      status: newStatus,
      verification_type: 'verified_by_ambassador',
      verified_by: auth.userId,
      ...(newStatus === 'published' ? { published_at: new Date().toISOString(), approved_at: new Date().toISOString(), approved_by: auth.userId } : {})
    })
    .eq('id', opportunityId)
    .eq('status', opp.status) // Concurrency check

  if (updateError) throw new Error(updateError.message)

  // Record timeline
  await supabase.from('opp_submissions_timeline').insert({
    opportunity_id: opportunityId,
    status: newStatus as any,
    actor_id: auth.userId,
    notes: notes || `Ambassador ${action}ed the submission`
  })

  // Audit log
  await supabase.from('opp_audit_logs').insert({
    action: action === 'approve' ? 'approve_opportunity' : (action === 'reject' ? 'reject_opportunity' : 'request_correction'),
    actor_id: auth.userId,
    target_id: opportunityId,
    target_type: 'opportunity',
    metadata: { notes }
  })

  // Send Notification to Society
  if (opp.society_id) {
    const { data: society } = await supabase.from('opp_societies').select('user_id').eq('id', opp.society_id).single()
    if (society) {
      await supabase.from('opp_notifications').insert({
        recipient_id: society.user_id,
        type: 'opportunity_status',
        title: notifTitle,
        body: notifBody,
        metadata: { opportunity_id: opportunityId }
      })
    }
  }

  revalidatePath('/ambassador/dashboard')
  revalidatePath('/ambassador/review')
  return { success: true }
}

export async function publishOpportunity(opportunityId: string) {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    throw new Error('Only admins can publish opportunities')
  }

  const supabase = await createClient()

  const { data: opp } = await supabase.from('opp_opportunities').select('title, society_id').eq('id', opportunityId).single()

  const { error: updateError } = await supabase
    .from('opp_opportunities')
    .update({ 
      status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('id', opportunityId)
    .eq('status', 'ready_for_publish') // safety check

  if (updateError) throw new Error(updateError.message)

  await supabase.from('opp_submissions_timeline').insert({
    opportunity_id: opportunityId,
    status: 'published',
    actor_id: auth.userId,
    notes: 'Published by Admin'
  })

  await supabase.from('opp_audit_logs').insert({
    action: 'publish_opportunity',
    actor_id: auth.userId,
    target_id: opportunityId,
    target_type: 'opportunity'
  })

  // Send Notification to Society
  if (opp && opp.society_id) {
    const { data: society } = await supabase.from('opp_societies').select('user_id').eq('id', opp.society_id).single()
    if (society) {
      await supabase.from('opp_notifications').insert({
        recipient_id: society.user_id,
        type: 'opportunity_published',
        title: 'Opportunity Published! 🎉',
        body: `Great news! Your opportunity "${opp.title}" has been published and is now live.`,
        metadata: { opportunity_id: opportunityId }
      })
    }
  }

  revalidatePath('/admin/opportunities')
  revalidatePath('/admin/dashboard')
  return { success: true }
}
