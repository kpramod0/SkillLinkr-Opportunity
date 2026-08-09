"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendPasswordResetOtp } from "@/app/actions/auth-reset"

function ForgotPasswordContent() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            await sendPasswordResetOtp(email)
            // Redirect to reset password page to enter OTP
            router.push(`/reset-password?email=${encodeURIComponent(email)}`)
        } catch (err: any) {
            setError(err.message || "Failed to send reset email")
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
                        <span className="text-xs font-bold tracking-widest uppercase text-auth-text-muted mb-4 block">ACCOUNT RECOVERY</span>
                        <h1 className="text-4xl lg:text-5xl font-bold text-auth-text-primary leading-tight mb-4">
                            Regain access to your <span className="bg-clip-text text-transparent bg-[var(--accent-gradient)]">opportunities.</span>
                        </h1>
                        <p className="text-base text-auth-text-secondary leading-relaxed max-w-md">
                            Enter your email to receive a password reset verification code.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center p-4 pt-24 sm:p-8 sm:pt-24 lg:p-8 relative z-30 lg:overflow-y-auto custom-scrollbar">
                    <div className="auth-panel w-full max-w-md p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] border border-[var(--auth-border)] shadow-xl relative mt-0 lg:mt-0">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-auth-text-primary">Reset password</h2>
                            <p className="text-sm text-auth-text-secondary mt-2">We'll send you an email with a 6-digit verification code.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
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

                            {error && (
                                <div className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full auth-btn-primary hover:opacity-90 h-12 font-semibold transition-opacity text-black mt-2"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                    <>
                                        Send reset code
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-[var(--auth-border)] text-center space-y-4">
                            <p className="text-sm text-auth-text-muted">
                                Remember your password? <Link href="/login" className="text-[var(--cyan)] font-semibold hover:underline">Log in</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-[var(--cyan)]" /></div>}>
            <ForgotPasswordContent />
        </Suspense>
    )
}
