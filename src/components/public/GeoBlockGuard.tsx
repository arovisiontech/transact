'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function GeoBlockGuard() {
  const pathname = usePathname()
  const router = useRouter()
  const [isBlocked, setIsBlocked] = useState(false)

  useEffect(() => {
    // 1. Never block admin or blocked pages
    if (!pathname || pathname.startsWith('/admin') || pathname === '/blocked') {
      return
    }

    // 2. Check for secret bypass in URL (e.g. ?bypass_geo=transact)
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const bypass = params.get('bypass_geo')
      if (bypass === 'transact' || bypass === 'transact2026') {
        localStorage.setItem('transact_geo_bypass', 'true')
        document.cookie = 'transact_geo_bypass=true; path=/; max-age=2592000'
        return
      }

      if (localStorage.getItem('transact_geo_bypass') === 'true') {
        return
      }

      // 3. Fast cache check in sessionStorage
      const cachedCountry = sessionStorage.getItem('transact_visitor_country')
      if (cachedCountry === 'PK') {
        setIsBlocked(true)
        window.location.replace('/blocked')
        return
      }
      if (cachedCountry && cachedCountry !== 'PK') {
        return
      }

      // 4. Verify Geo-location from server API & fallback GeoIP
      const verifyCountry = async () => {
        try {
          // A. Check internal /api/geo first
          const res = await fetch('/api/geo', { cache: 'no-store' })
          if (res.ok) {
            const data = await res.json()
            if (data.isBlocked || data.country === 'PK') {
              sessionStorage.setItem('transact_visitor_country', 'PK')
              document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
              setIsBlocked(true)
              window.location.replace('/blocked')
              return
            }
            if (data.country && data.country !== 'UNKNOWN' && data.country !== 'LOCAL') {
              sessionStorage.setItem('transact_visitor_country', data.country)
              return
            }
          }

          // B. Secondary direct client-side lookup if server header wasn't set
          const directRes = await fetch('https://api.country.is/', { cache: 'no-store' })
          if (directRes.ok) {
            const directData = await directRes.json()
            const code = (directData.country || '').toUpperCase()
            if (code === 'PK') {
              sessionStorage.setItem('transact_visitor_country', 'PK')
              document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
              setIsBlocked(true)
              window.location.replace('/blocked')
              return
            }
            if (code) {
              sessionStorage.setItem('transact_visitor_country', code)
            }
          }
        } catch (err) {
          console.warn('Geo-verification notice:', err)
        }
      }

      verifyCountry()
    }
  }, [pathname, router])

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[99999] bg-[#081022] text-white flex items-center justify-center p-6 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full border-2 border-red-500/40 border-t-red-500 animate-spin" />
          <p className="text-sm font-bold text-zinc-300">Checking Regional Authorization...</p>
        </div>
      </div>
    )
  }

  return null
}
