"use client"

import { Suspense, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, KeyRound, ArrowRight, Loader2, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase-client"

function LoginContent() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const searchParams = useSearchParams()

    useEffect(() => {
        const err = searchParams?.get('error')
        if (err === 'unauthorized') {
            setError("You don't have permission to access that area. Please log in.")
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const supabase = createClient()
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            
            if (signInError) throw signInError

            // Hard navigate to ensure cookies are sent to the server
            window.location.href = "/auth/callback"
        } catch (err: any) {
            setError(err.message || "Invalid email or password")
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        if (isLoading) return;
        try {
            setIsLoading(true)
            setError("")
            const siteUrl = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001')
            const supabase = createClient()

            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${siteUrl}/auth/callback`,
                    queryParams: { prompt: 'select_account' },
                }
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message || 'Failed to start Google Sign In. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <div className="auth-canvas-bg min-h-screen p-4 sm:p-6 flex items-center justify-center">
            <div className="auth-shell w-full max-w-[1500px] min-h-[calc(100vh-48px)] rounded-[28px] sm:rounded-[36px] overflow-hidden flex flex-col lg:flex-row shadow-2xl relative border border-[var(--auth-border)]">
                
                <header className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
                            SkillLinkr
                        </span>
                        <span className="text-xl font-semibold text-auth-text-muted ml-1">Opportunities</span>
                    </Link>
                </header>

                <div className="auth-left-area hidden lg:flex w-[60%] relative flex-col overflow-hidden pt-24 px-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--auth-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--auth-border)_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 animate-grid-drift"></div>
                    <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[var(--cyan)] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[var(--emerald)] rounded-full blur-[100px] opacity-10 pointer-events-none"></div>

                    <div className="relative z-50 max-w-xl mt-8 pointer-events-auto">
                        <span className="text-xs font-bold tracking-widest uppercase text-auth-text-muted mb-4 block">WELCOME BACK</span>
                        <h1 className="text-4xl lg:text-5xl font-bold text-auth-text-primary leading-tight mb-4">
                            Opportunities that <span className="bg-clip-text text-transparent bg-[var(--accent-gradient)]">move students forward.</span>
                        </h1>
                        <p className="text-base text-auth-text-secondary leading-relaxed max-w-md">
                            The centralized platform for university societies and campus ambassadors to manage, publish, and review opportunities.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center p-4 pt-24 sm:p-8 sm:pt-24 lg:p-8 relative z-30 lg:overflow-y-auto custom-scrollbar">
                    <div className="auth-panel w-full max-w-md p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] border border-[var(--auth-border)] shadow-xl relative mt-0 lg:mt-0">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-auth-text-primary">Welcome back</h2>
                            <p className="text-sm text-auth-text-secondary mt-2">Log in to manage opportunities for your community.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleGoogleLogin}
                                className="w-full bg-transparent border-[var(--auth-border)] hover:bg-[var(--auth-border)] text-auth-text-primary transition-all duration-200 h-12"
                                disabled={isLoading}
                            >
                                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continue with Google
                            </Button>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-[var(--auth-border)]"></span>
                                </div>
                                <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-wider text-auth-text-muted">
                                    <span className="bg-[var(--auth-panel)] px-4">OR CONTINUE WITH EMAIL</span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-sm font-medium text-auth-text-primary">Email address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-auth-text-muted" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@university.edu"
                                        className="pl-10 h-12 auth-input border-[var(--auth-border)]"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-sm font-medium text-auth-text-primary">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-auth-text-muted" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        className="pl-10 pr-10 h-12 auth-input border-[var(--auth-border)]"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-3.5 text-auth-text-muted hover:text-auth-text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end mt-1">
                                <Link href="/forgot-password" className="text-sm text-[var(--cyan)] hover:opacity-80 font-medium transition-opacity">
                                    Forgot password?
                                </Link>
                            </div>

                            {error && (
                                <div className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full auth-btn-primary hover:opacity-90 h-12 font-semibold transition-opacity text-black"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Log in"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-[var(--auth-border)] text-center space-y-4">
                            <p className="text-sm text-auth-text-muted">
                                Need access? <Link href="/signup" className="text-[var(--cyan)] font-semibold hover:underline">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-[var(--cyan)]" /></div>}>
            <LoginContent />
        </Suspense>
    )
}
