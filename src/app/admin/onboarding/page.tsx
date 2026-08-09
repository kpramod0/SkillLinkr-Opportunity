import { requireAuth } from '@/app/actions/auth-helpers'
import { resolveOmsIdentity } from '@/lib/role-resolver'
import { redirect } from 'next/navigation'
import AdminOnboardingClient from './client'

export const dynamic = 'force-dynamic'

export default async function AdminOnboardingPage() {
  const auth = await requireAuth()
  const identity = await resolveOmsIdentity(auth.user.email!)

  if (identity.role !== 'admin') {
    redirect('/login')
  }

  if (identity.onboardingCompleted) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Setup</h1>
            <p className="text-sm text-gray-500">Complete your profile to access the dashboard.</p>
          </div>
          <AdminOnboardingClient email={auth.user.email!} />
        </div>
      </div>
    </div>
  )
}
