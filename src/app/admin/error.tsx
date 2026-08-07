"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        An error occurred while loading this section of the admin portal.
      </p>
      <button
        onClick={() => reset()}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Try again
      </button>
    </div>
  )
}
