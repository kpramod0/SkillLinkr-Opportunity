"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completeAdminOnboarding } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export default function AdminOnboardingClient({ email }: { email: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await completeAdminOnboarding({ name })
      // Onboarding complete, router.refresh will trigger middleware to allow dashboard access
      router.refresh()
      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input type="email" value={email} disabled className="bg-gray-50" />
        <p className="text-xs text-gray-500 mt-1">Managed by SkillLinkr</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
        <Input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          placeholder="E.g. Jane Doe"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Complete Setup
      </Button>
    </form>
  )
}
