import { requireAuth } from '@/app/actions/auth-helpers'
import { resolveOmsIdentity } from '@/lib/role-resolver'
import { redirect } from 'next/navigation'
import SocietyOnboardingClient from './client'

export const dynamic = 'force-dynamic'

export default async function SocietyOnboardingPage() {
  const auth = await requireAuth()
  const identity = await resolveOmsIdentity(auth.user.email!)

  if (identity.role !== 'society_candidate' && identity.role !== 'society') {
    redirect('/login')
  }

  if (identity.onboardingCompleted) {
    redirect('/society/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 border-b border-gray-100 bg-cyan-50">
          <div className="mb-2">
            <span className="bg-cyan-100 text-cyan-800 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Society Registration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Register your Society</h1>
          <p className="text-sm text-gray-600">You're eligible to register a society for {identity.college?.name}. Let's get you set up.</p>
        </div>
        <div className="p-8">
          <SocietyOnboardingClient 
            identity={{
              email: auth.user.email!,
              collegeName: identity.college?.name || 'Unknown College'
            }} 
          />
        </div>
      </div>
    </div>
  )
}
