"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowRight, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { verifyOtpAndResetPassword } from "@/app/actions/auth-reset"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const emailParam = searchParams?.get('email')
        if (emailParam) {
            setEmail(emailParam)
        } else {
            router.replace('/forgot-password')
        }
    }, [searchParams, router])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            const pastedData = value.slice(0, 6).split('')
            const newOtp = [...otp]
            pastedData.forEach((char, i) => {
                if (index + i < 6) newOtp[index + i] = char
            })
            setOtp(newOtp)
            
            const nextEmptyIndex = newOtp.findIndex(val => val === '')
            if (nextEmptyIndex !== -1 && nextEmptyIndex < 6 && inputRefs.current[nextEmptyIndex]) {
                inputRefs.current[nextEmptyIndex]?.focus()
            } else if (inputRefs.current[5]) {
                inputRefs.current[5]?.focus()
            }
            return
        }

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const fullOtp = otp.join('')
        if (fullOtp.length !== 6) {
            setError("Please enter the complete 6-digit verification code.")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            await verifyOtpAndResetPassword(email, fullOtp, password)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || "Failed to reset password. The code might be expired.")
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
                            Verify the code sent to your email and set a new password.
                        </p>
                    </div>
                </div>

                <div className="w-full lg:w-[40%] flex items-start lg:items-center justify-center p-4 pt-24 sm:p-8 sm:pt-24 lg:p-8 relative z-30 lg:overflow-y-auto custom-scrollbar">
                    <div className="auth-panel w-full max-w-md p-6 sm:p-10 rounded-[24px] sm:rounded-[28px] border border-[var(--auth-border)] shadow-xl relative mt-0 lg:mt-0">
                        
                        {success ? (
                            <div className="text-center space-y-6">
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold text-auth-text-primary">Password Reset!</h2>
                                <p className="text-sm text-auth-text-secondary">
                                    Your password has been successfully reset. You can now log in with your new password.
                                </p>
                                <Link href="/login" className="block mt-8">
                                    <Button className="w-full h-12 auth-btn-primary text-black font-semibold">
                                        Log in
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-auth-text-primary">Set new password</h2>
                                    <p className="text-sm text-auth-text-secondary mt-2">Enter the verification code sent to {email}</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    
                                    <div className="space-y-3">
                                        <label className="text-sm font-medium text-auth-text-primary">Verification Code</label>
                                        <div className="flex justify-between gap-2">
                                            {otp.map((digit, index) => (
                                                <Input
                                                    key={index}
                                                    ref={el => { inputRefs.current[index] = el }}
                                                    type="text"
                                                    maxLength={6}
                                                    value={digit}
                                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                                    className="w-12 h-14 text-center text-xl font-bold auth-input border-[var(--auth-border)]"
                                                    disabled={isLoading}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-auth-text-primary">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-auth-text-muted" />
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
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

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-auth-text-primary">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-auth-text-muted" />
                                            <Input
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                                className="pl-10 pr-10 h-12 auth-input border-[var(--auth-border)]"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3.5 top-3.5 text-auth-text-muted hover:text-auth-text-primary transition-colors"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="text-red-500 bg-red-500/10 p-3 rounded-lg text-sm border border-red-500/20">
                                            {error}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full auth-btn-primary hover:opacity-90 h-12 font-semibold transition-opacity text-black mt-4"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                                            <>
                                                Reset password
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-[var(--cyan)]" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
