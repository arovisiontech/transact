'use client'

import { useState, useEffect, ReactNode } from 'react'

/**
 * ClientOnly — renders children ONLY after client-side hydration.
 * Use this to wrap any component that reads from localStorage / browser APIs
 * to prevent SSR ↔ client hydration mismatches.
 *
 * Optionally pass `fallback` to show a skeleton while mounting.
 */
export default function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{fallback}</>
  return <>{children}</>
}
