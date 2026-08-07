"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    representativeName: '',
    contactNumber: '',
    collegeId: '',
    societyName: '',
    position: ''
  })
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // In a real implementation, you would fetch colleges from the DB
  const mockColleges = [
    { id: '123e4567-e89b-12d3-a456-426614174000', name: 'KIIT University' }
  ]

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Sign up auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // 2. The trigger handles opp_users creation, but we need to update role and create society profile
        // In a real implementation, you'd use a secure edge function or RPC for this
        // For the sake of this scaffolding, we'll assume it's handled or we update directly
        // if RLS allows (which it typically wouldn't for security).
        
        setSuccess(true)
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Registration failed')
      } else {
        setError('Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-sm text-center">
          <h2 className="text-2xl font-bold text-emerald-500 mb-4">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Please check your email to verify your account. After verification, an Admin will review your society registration.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 py-12">
      <div className="w-full max-w-xl bg-card border rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Register Society</h1>
          <p className="text-muted-foreground mt-2">Join SkillLinkr Opportunities to publish events</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">College Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Society Name</label>
              <input
                type="text"
                name="societyName"
                value={formData.societyName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">College</label>
              <select
                name="collegeId"
                value={formData.collegeId}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              >
                <option value="">Select College</option>
                {mockColleges.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Representative Name</label>
              <input
                type="text"
                name="representativeName"
                value={formData.representativeName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Position in Society</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Contact Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border bg-background text-foreground"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-6 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register Society'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{' '}
          <a href="/login" className="text-primary hover:underline font-medium">
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
