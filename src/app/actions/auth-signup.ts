'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { getCollegeByDomain } from '@/lib/colleges' // Check if this exists, else implement it
import { sendOtpEmail } from '@/lib/mailer'
import crypto from 'crypto'
import { societyOnboardingSchema } from '@/validations/schemas'

export async function checkEligibility(email: string) {
  if (!email) throw new Error('Email is required')
  
  const supabase = await createAdminClient()

  // 0. Check if user already exists in auth.users
  const { data: authUsers } = await supabase.auth.admin.listUsers()
  const authUserExists = authUsers?.users?.find(u => u.email === email.toLowerCase().trim())
  
  if (authUserExists) {
    throw new Error('An account with this email already exists. Please log in instead.')
  }

  const { data: existingUser } = await supabase.from('opp_users').select('id, role').eq('email', email.toLowerCase().trim()).maybeSingle()
  if (existingUser) {
    // They are seeded manually but don't exist in auth.users. Allow signup with their seeded role!
    return { eligible: true, role: existingUser.role }
  }

  // 1. Check Admin
  const { data: admin } = await supabase.from('opp_admin_allowlist').select('*').eq('email', email).maybeSingle()
  if (admin && admin.is_active) {
    return { eligible: true, role: 'admin' }
  }

  // 2. Check Ambassador
  const { data: ambassador } = await supabase.from('opp_ambassador_invitations').select('*').eq('email', email).in('status', ['invited', 'active']).maybeSingle()
  if (ambassador) {
    return { eligible: true, role: 'ambassador' }
  }

  // 3. Check Society (Valid College Domain)
  const domainMatch = email.match(/@(.+)$/)
  if (!domainMatch) {
    throw new Error('Invalid email format')
  }
  
  const domain = domainMatch[1]
  const { data: college } = await supabase.from('opp_colleges').select('*').eq('email_domain', domain).eq('is_active', true).limit(1).maybeSingle()
  
  if (college) {
    return { eligible: true, role: 'society', college }
  }

  // Fallback check using the old main profile verifier if needed
  throw new Error('Your University is not registered yet.')
}

export async function sendSignupOtp(email: string) {
  const supabase = await createAdminClient()

  // Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins

  // Invalidate previous OTPs
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
    throw new Error('Failed to send verification email. Please check configuration.')
  }
}

export async function verifyOtpAndCreateUser(email: string, password: string, otp: string, role: string, formData?: any) {
  const supabase = await createAdminClient()

  // Verify OTP
  const { data: otpRecord, error: otpError } = await supabase
    .from('opp_otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('otp_code', otp)
    .eq('is_used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (otpError || !otpRecord) {
    throw new Error('Invalid or expired OTP code.')
  }

  // Mark as used
  await supabase.from('opp_otp_verifications').update({ is_used: true }).eq('id', otpRecord.id)

  // Validate formData if role is society
  let validData = null
  let collegeId = null
  if (role === 'society' && formData) {
    const result = societyOnboardingSchema.safeParse(formData)
    if (!result.success) {
      throw new Error(result.error.issues[0]?.message || result.error.message || 'Form validation failed.')
    }
    validData = result.data

    // Need college ID
    const domain = email.match(/@(.+)$/)?.[1]
    const { data: college } = await supabase.from('opp_colleges').select('id').eq('email_domain', domain).limit(1).maybeSingle()
    if (!college) throw new Error('College not found.')
    collegeId = college.id
  }

  // Create Auth User
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    throw new Error(`Failed to create account: ${authError.message}`)
  }

  const userId = authData.user.id

  // Clean up any manually seeded orphaned records before inserting the correct one
  await supabase.from('opp_users').delete().eq('email', email.toLowerCase().trim())

  // If Society, create opp_users and opp_societies
  if (role === 'society' && validData && collegeId) {
    await supabase.from('opp_users').insert({
      id: userId,
      email: email.toLowerCase().trim(),
      role: 'society',
      status: 'active',
      onboarding_completed: true
    })

    if (validData.is_society_member && validData.societies && validData.societies.length > 0) {
      const societyInserts = validData.societies.map((soc: any) => ({
        user_id: userId,
        college_id: collegeId,
        society_name: soc.society_name,
        representative_name: validData.representative_name,
        contact_number: validData.contact_number,
        position: soc.position,
        photos: validData.photos,
        linkedin_url: validData.linkedin_url,
        instagram_url: validData.instagram_url,
        whatsapp_number: validData.whatsapp_number,
        github_url: validData.github_url,
        year_of_studying: validData.year_of_studying
      }))
      
      await supabase.from('opp_societies').insert(societyInserts)
      
      await supabase.from('opp_audit_logs').insert({
        action: 'SOCIETY_REGISTERED',
        entity_type: 'user',
        entity_id: userId,
        actor_id: userId,
        actor_role: 'society',
        details: { societies: validData.societies, via: 'signup_wizard' }
      })
    }
  } else if (role === 'super_admin' || role === 'admin' || role === 'ambassador') {
    // Re-insert their opp_users record with the new ID
    await supabase.from('opp_users').insert({
      id: userId,
      email: email.toLowerCase().trim(),
      role: role,
      status: 'active',
      onboarding_completed: false
    })
  }

  // NOTE: The user is NOT logged in by `admin.createUser`. 
  // We return success, and the frontend will call `supabase.auth.signInWithPassword` to establish the session cookies!
  return { success: true }
}
