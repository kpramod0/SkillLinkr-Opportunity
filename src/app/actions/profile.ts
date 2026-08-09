'use server'

import { createClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'
import { revalidatePath } from 'next/cache'

export async function updateSocietyProfile(data: {
  society_name: string;
  representative_name: string;
  contact_number: string;
  position: string;
}) {
  const auth = await requireAuth()
  if (auth.role !== 'society' || !auth.societyId) {
    throw new Error('Only societies can update their profile')
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from('opp_societies')
    .update({
      society_name: data.society_name,
      representative_name: data.representative_name,
      contact_number: data.contact_number,
      position: data.position
    })
    .eq('id', auth.societyId)
    .eq('user_id', auth.userId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/society/profile')
  revalidatePath('/society/dashboard')
  
  return { success: true }
}

export async function updateAmbassadorProfile(data: {
  full_name: string;
  department: string;
  year: number;
  contact_number: string;
}) {
  const auth = await requireAuth()
  if (auth.role !== 'ambassador' || !auth.ambassadorId) {
    throw new Error('Only ambassadors can update their profile')
  }

  const supabase = await createClient()

  // Update ambassador details
  const { error: ambError } = await supabase
    .from('opp_ambassadors')
    .update({
      full_name: data.full_name,
      department: data.department,
      year: data.year,
      contact_number: data.contact_number
    })
    .eq('id', auth.ambassadorId)
    .eq('user_id', auth.userId)

  if (ambError) {
    throw new Error(ambError.message)
  }

  // Sync full_name to opp_users.name for consistency
  await supabase
    .from('opp_users')
    .update({ name: data.full_name })
    .eq('id', auth.userId)

  revalidatePath('/ambassador/profile')
  revalidatePath('/ambassador/dashboard')
  
  return { success: true }
}

