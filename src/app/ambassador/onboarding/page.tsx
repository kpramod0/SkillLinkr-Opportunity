import { requireAuth } from '@/app/actions/auth-helpers'
import { resolveOmsIdentity } from '@/lib/role-resolver'
import { createAdminClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import AmbassadorOnboardingClient from './client'

export const dynamic = 'force-dynamic'

export default async function AmbassadorOnboardingPage() {
  const auth = await requireAuth()
  const identity = await resolveOmsIdentity(auth.user.email!)

  if (identity.role !== 'ambassador') {
    redirect('/login')
  }

  if (identity.onboardingCompleted) {
    redirect('/ambassador/dashboard')
  }

  if (!identity.invitationId) {
    // Should not happen based on resolver
    return <div>No invitation found.</div>
  }

  const supabase = await createAdminClient()
  const { data: inv } = await supabase
    .from('opp_ambassador_invitations')
    .select('*, opp_colleges(name)')
    .eq('id', identity.invitationId)
    .single()

  if (!inv) return <div>Invalid invitation.</div>

  const collegeName = Array.isArray(inv.opp_colleges) ? inv.opp_colleges[0]?.name : inv.opp_colleges?.name

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-100 bg-emerald-50">
          <div className="mb-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Ambassador Invitation
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SkillLinkr OMS</h1>
          <p className="text-sm text-gray-600">Complete your profile to accept your ambassador role for {collegeName}.</p>
        </div>
        <div className="p-8">
          <AmbassadorOnboardingClient 
            invitation={{
              email: inv.email,
              name: inv.full_name,
              college: collegeName || 'Unknown College',
              phone: inv.mobile_number || ''
            }} 
          />
        </div>
      </div>
    </div>
  )
}
