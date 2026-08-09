'use server'

import { createAdminClient } from '@/lib/supabase-server'
import { sendOtpEmail } from '@/lib/mailer'

export async function sendPasswordResetOtp(email: string) {
  if (!email) throw new Error('Email is required')

  const supabase = await createAdminClient()

  // 1. Verify user exists in auth.users
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  if (userError) throw new Error('Failed to verify user account.')

  const user = users.users.find(u => u.email === email)
  if (!user) {
    throw new Error('No account found with this email.')
  }

  // 2. Generate 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 mins

  // 3. Invalidate previous OTPs
  await supabase
    .from('opp_otp_verifications')
    .update({ is_used: true })
    .eq('email', email)
    .eq('is_used', false)

  // 4. Insert new OTP
  const { error: insertError } = await supabase
    .from('opp_otp_verifications')
    .insert({
      email,
      otp_code: otpCode,
      expires_at: expiresAt
    })

  if (insertError) {
    throw new Error('Failed to generate reset code.')
  }

  // 5. Send Email
  try {
    await sendOtpEmail(email, otpCode)
    return { success: true }
  } catch (err: any) {
    console.error('Failed to send reset email:', err)
    throw new Error('Failed to send reset email. Please check configuration.')
  }
}

export async function verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
  if (!email || !otp || !newPassword) throw new Error('All fields are required')

  const supabase = await createAdminClient()

  // 1. Verify OTP
  const { data: otpRecord, error: otpError } = await supabase
    .from('opp_otp_verifications')
    .select('*')
    .eq('email', email)
    .eq('otp_code', otp)
    .eq('is_used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (otpError || !otpRecord) {
    throw new Error('Invalid or expired OTP code.')
  }

  // 2. Mark as used
  await supabase.from('opp_otp_verifications').update({ is_used: true }).eq('id', otpRecord.id)

  // 3. Find user in auth.users
  const { data: users, error: userError } = await supabase.auth.admin.listUsers()
  if (userError) throw new Error('Failed to retrieve user account.')

  const user = users.users.find(u => u.email === email)
  if (!user) {
    throw new Error('User not found.')
  }

  // 4. Update Password using Admin API
  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    password: newPassword
  })

  if (updateError) {
    throw new Error(`Failed to reset password: ${updateError.message}`)
  }

  return { success: true }
}
