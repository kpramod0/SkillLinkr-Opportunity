"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Fetch role to redirect
        const { data: profile } = await supabase
          .from('opp_users')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profile) {
          switch (profile.role) {
            case 'super_admin':
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'ambassador':
              router.push('/ambassador/dashboard')
              break
            case 'society':
              router.push('/society/dashboard')
              break
            default:
              router.push('/')
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to login')
      } else {
        setError('Failed to login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card border rounded-2xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to SkillLinkr Opportunities</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-primary hover:underline font-medium">
            Register your Society
          </a>
        </div>
      </div>
    </div>
  )
}
