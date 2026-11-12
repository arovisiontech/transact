'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App Error Boundary caught error:', error)
    if (
      error?.message?.toLowerCase().includes('hydration') ||
      error?.digest?.toLowerCase().includes('hydration') ||
      error?.message?.toLowerCase().includes('loading chunk')
    ) {
      reset()
    }
  }, [error, reset])

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.clear()
        sessionStorage.clear()
      } catch {}
      window.location.href = '/'
    } else {
      reset()
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 text-center">
      <div className="max-w-md space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-[#F6851F]">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-sm text-slate-600">
          The page encountered a temporary issue. Click below to reload.
        </p>
        <button
          onClick={handleReset}
          className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white text-sm font-bold rounded-xl shadow-md transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

