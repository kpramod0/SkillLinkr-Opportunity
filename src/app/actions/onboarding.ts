'use server'

import { createAdminClient, createClient } from '@/lib/supabase-server'
import { requireAuth } from './auth-helpers'
import { resolveOmsIdentity } from '@/lib/role-resolver'
import { adminOnboardingSchema, ambassadorOnboardingSchema, societyOnboardingSchema } from '@/validations/schemas'
import { sendOtpEmail } from '@/lib/mailer'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'

export async function completeAdminOnboarding(data: { name: string }) {
  const auth = await requireAuth()
  
  // Validate payload
  const result = adminOnboardingSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.issues?.[0]?.message || result.error.message || 'Validation failed')
  }

  const supabase = await createAdminClient()
  
  // Verify this user is an admin
  const identity = await resolveOmsIdentity(auth.user.email!)
  if (identity.role !== 'admin') {
    throw new Error('Not authorized for admin onboarding')
  }

  // Update or insert opp_users
  const { error: userError } = await supabase
    .from('opp_users')
    .upsert({
      id: auth.userId,
      email: auth.user.email!,
      role: 'admin',
      status: 'active',
      onboarding_completed: true
    })

  if (userError) throw new Error(`Failed to update profile: ${userError.message}`)

  // Create audit log
  await supabase.from('opp_audit_logs').insert({
    action: 'ADMIN_ONBOARDING_COMPLETED',
    entity_type: 'user',
    entity_id: auth.userId,
    actor_id: auth.userId,
    actor_role: 'admin',
    details: { name: data.name }
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function activateAmbassadorAccount(data: any) {
  const auth = await requireAuth()
  
  // Validate payload
  const result = ambassadorOnboardingSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.issues?.[0]?.message || result.error.message || 'Validation failed')
  }

  const supabase = await createAdminClient()
  
  // Verify this user has an invitation
  const identity = await resolveOmsIdentity(auth.user.email!)
  if (identity.role !== 'ambassador' || !identity.invitationId) {
    throw new Error('No valid ambassador invitation found for this email')
  }

  // Transaction-like approach
  // 1. Get invitation data
  const { data: inv, error: invError } = await supabase
    .from('opp_ambassador_invitations')
    .select('*')
    .eq('id', identity.invitationId)
    .single()

  if (invError || !inv) throw new Error('Invitation not found')

  // 2. Create opp_users record
  const { error: userError } = await supabase
    .from('opp_users')
    .upsert({
      id: auth.userId,
      email: auth.user.email!,
      role: 'ambassador',
      status: 'active',
      onboarding_completed: true
    })

  if (userError) throw new Error(`Failed to create profile: ${userError.message}`)

  // 3. Create opp_ambassadors record
  const { error: ambError } = await supabase
    .from('opp_ambassadors')
    .upsert({
      user_id: auth.userId,
      college_id: inv.college_id,
      full_name: inv.full_name,
      contact_number: inv.mobile_number,
      academic_year: data.academic_year,
      graduation_year: data.graduation_year,
      branch: data.branch,
      course: data.course,
      student_id: data.student_id,
      linkedin_url: data.linkedin_url,
      photo_url: data.photo_url,
      is_society_member: data.is_society_member,
      societies: data.societies || [],
      onboarding_completed: true
    }, { onConflict: 'user_id' })

  if (ambError) {
    // Attempt rollback
    await supabase.from('opp_users').delete().eq('id', auth.userId)
    throw new Error(`Failed to create ambassador profile: ${ambError.message}`)
  }

  // 4. Mark invitation as active
  await supabase
    .from('opp_ambassador_invitations')
    .update({ 
      status: 'active',
      account_created_at: new Date().toISOString()
    })
    .eq('id', inv.id)

  // 5. Audit log
  await supabase.from('opp_audit_logs').insert({
    action: 'AMBASSADOR_ONBOARDING_COMPLETED',
    entity_type: 'user',
    entity_id: auth.userId,
    actor_id: auth.userId,
    actor_role: 'ambassador',
    details: { invitation_id: inv.id }
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function registerSocietySelf(data: any) {
  const auth = await requireAuth()
  
  // Validate payload
  const result = societyOnboardingSchema.safeParse(data)
  if (!result.success) {
    throw new Error(result.error.issues?.[0]?.message || result.error.message || 'Validation failed')
  }

  const supabase = await createAdminClient()
  
  // Verify this user is eligible to be a society
  const identity = await resolveOmsIdentity(auth.user.email!)
  if ((identity.role !== 'society_candidate' && identity.role !== 'society') || !identity.college) {
    throw new Error('Not eligible for society registration')
  }

  // 1. Create opp_users record
  const { error: userError } = await supabase
    .from('opp_users')
    .upsert({
      id: auth.userId,
      email: auth.user.email!,
      role: 'society',
      status: 'active',
      onboarding_completed: true
    })

  if (userError) throw new Error(`Failed to create profile: ${userError.message}`)

  // Extract society details from the array
  const societyDetails = data.societies?.[0] || { society_name: '', position: '' }

  // 2. Create opp_societies record
  const { error: socError } = await supabase
    .from('opp_societies')
    .upsert({
      user_id: auth.userId,
      college_id: identity.college.id,
      society_name: societyDetails.society_name,
      representative_name: data.representative_name,
      contact_number: data.contact_number,
      position: societyDetails.position,
      photos: data.photos,
      linkedin_url: data.linkedin_url,
      instagram_url: data.instagram_url,
      whatsapp_number: data.whatsapp_number
    }, { onConflict: 'user_id' })

  if (socError) {
    // Attempt rollback
    await supabase.from('opp_users').delete().eq('id', auth.userId)
    throw new Error(`Failed to create society profile: ${socError.message}`)
  }

  // 3. Audit log
  await supabase.from('opp_audit_logs').insert({
    action: 'SOCIETY_REGISTERED',
    entity_type: 'user',
    entity_id: auth.userId,
    actor_id: auth.userId,
    actor_role: 'society',
    details: { society_name: societyDetails.society_name, college_id: identity.college.id }
  })

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function sendVerificationOtp() {
  const auth = await requireAuth()
  const email = auth.user.email!

  const supabase = await createAdminClient()

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins

  // Invalidate previous OTPs for this email
  await supabase
    .from('opp_otp_verifications')
    .update({ is_used: true })
    .eq('email', email)
    .eq('is_used', false)

  // Insert new OTP
  const { error } = await supabase
    .from('opp_otp_verifications')
    .insert({
      email,
      otp_code: otpCode,
      expires_at: expiresAt
    })

  if (error) {
    throw new Error('Failed to generate verification code.')
  }

  // Send Email
  try {
    await sendOtpEmail(email, otpCode)
    return { success: true }
  } catch (err: any) {
    console.error('Failed to send email:', err)
    throw new Error('Failed to send verification email. Please try again.')
  }
}

export async function verifyOtp(code: string) {
  const auth = await requireAuth()
  const email = auth.user.email!

  const supabase = await createAdminClient()

  // Find the valid OTP
  const { data: otpRecord, error } = await supabase
    .from('opp_otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('otp_code', code)
    .eq('is_used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !otpRecord) {
    throw new Error('Invalid or expired verification code.')
  }

  // Mark as used
  await supabase
    .from('opp_otp_verifications')
    .update({ is_used: true })
    .eq('id', otpRecord.id)

  return { success: true }
}
