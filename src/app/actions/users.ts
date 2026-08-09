'use server'

import { createAdminClient, createClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'
import { revalidatePath } from 'next/cache'

export async function registerAmbassador(data: {
  email: string,
  college_id: string,
  full_name: string,
  mobile_number?: string,
}) {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    throw new Error('Only admins can register ambassadors')
  }

  const supabaseAdmin = await createAdminClient()

  // Verify email doesn't already exist in opp_users
  const { data: existingUser } = await supabaseAdmin
    .from('opp_users')
    .select('id')
    .eq('email', data.email.toLowerCase().trim())
    .maybeSingle()

  if (existingUser) {
    throw new Error('User already exists in the system')
  }

  // Insert into opp_ambassador_invitations
  const { error: invError } = await supabaseAdmin
    .from('opp_ambassador_invitations')
    .insert({
      email: data.email.toLowerCase().trim(),
      full_name: data.full_name,
      college_id: data.college_id,
      mobile_number: data.mobile_number,
      invited_by: auth.userId
    })

  if (invError) {
    if (invError.code === '23505') { // unique violation
      throw new Error('An invitation for this email already exists')
    }
    throw new Error(`Failed to create invitation: ${invError.message}`)
  }

  // Audit log
  await supabaseAdmin.from('opp_audit_logs').insert({
    action: 'AMBASSADOR_INVITED',
    entity_type: 'invitation',
    entity_id: data.email, // using email as id for audit purposes since we don't have the uuid returning easily without .select()
    actor_id: auth.userId,
    actor_role: 'admin',
    details: { college_id: data.college_id }
  })

  revalidatePath('/admin/ambassadors')
  return { success: true }
}

export async function registerSociety(data: {
  email: string,
  password: string,
  college_id: string,
  society_name: string,
  representative_name: string,
  contact_number?: string,
  position?: string
}) {
  const auth = await requireAuth()
  if (auth.role !== 'admin' && auth.role !== 'super_admin') {
    throw new Error('Only admins can register societies')
  }

  const supabaseAdmin = await createAdminClient()
  const supabase = await createClient()

  // 1. Create auth user
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true
  })

  if (authError) {
    throw new Error(`Failed to create auth user: ${authError.message}`)
  }

  const userId = authUser.user.id

  // 2. Insert into opp_users
  const { error: oppUserError } = await supabaseAdmin
    .from('opp_users')
    .insert({
      id: userId,
      email: data.email,
      role: 'society',
      status: 'active'
    })

  if (oppUserError) {
    await supabaseAdmin.auth.admin.deleteUser(userId)
    throw new Error(`Failed to create profile: ${oppUserError.message}`)
  }

  // 3. Insert into opp_societies
  const { error: socError } = await supabaseAdmin
    .from('opp_societies')
    .insert({
      user_id: userId,
      college_id: data.college_id,
      society_name: data.society_name,
      representative_name: data.representative_name,
      contact_number: data.contact_number,
      position: data.position
    })

  if (socError) {
    throw new Error(`Failed to link society profile: ${socError.message}`)
  }

  revalidatePath('/admin/societies')
  return { success: true }
}
