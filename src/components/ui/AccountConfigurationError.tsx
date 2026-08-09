import { AlertTriangle, LogOut } from 'lucide-react'
import Link from 'next/link'

export function AccountConfigurationError({ type }: { type: 'ambassador' | 'society' }) {
  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h1 className="text-3xl font-bold text-foreground mb-3">Account Configuration Error</h1>
      <p className="text-muted-foreground text-lg mb-8 max-w-lg">
        Your {type} profile is incomplete or corrupted in the database. This typically happens if the initial registration process was interrupted.
      </p>
      
      <div className="bg-muted/30 border rounded-2xl p-6 text-left w-full space-y-4 mb-8">
        <h3 className="font-semibold text-foreground">How to fix this:</h3>
        <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
          <li>Sign out of this account using the button below.</li>
          <li>Contact a platform Administrator.</li>
          <li>Ask them to register a <strong>new</strong> {type} account for you from the Admin Dashboard.</li>
        </ol>
      </div>

      <Link 
        href="/login" 
        className="flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-xl font-medium hover:bg-foreground/90 transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Sign out and return to Login
      </Link>
    </div>
  )
}
