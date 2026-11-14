'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function GeoBlockGuard() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    // 1. Never block admin, preview, blocked or api routes
    if (
      !pathname ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/preview') ||
      pathname.startsWith('/api') ||
      pathname === '/blocked'
    ) {
      return
    }

    const params = new URLSearchParams(window.location.search)

    // Allow clearing bypass to test blocked screen: ?reset=1, ?clear=1, ?exit=1
    if (params.get('reset') === '1' || params.get('clear') === '1' || params.get('exit') === '1') {
      localStorage.removeItem('transact_geo_bypass')
      document.cookie = 'transact_geo_bypass=; path=/; max-age=0'
      window.location.replace('/blocked')
      return
    }

    // 2. Check for secret preview bypass in URL (e.g. ?preview=transact, ?preview=1, ?secret=transact)
    const bypassParam =
      params.get('bypass_geo') ||
      params.get('preview') ||
      params.get('secret') ||
      params.get('access')

    if (
      bypassParam === 'transact' ||
      bypassParam === 'transact2026' ||
      bypassParam === '1' ||
      bypassParam === 'true' ||
      bypassParam === 'live'
    ) {
      localStorage.setItem('transact_geo_bypass', 'true')
      document.cookie = 'transact_geo_bypass=true; path=/; max-age=31536000; SameSite=Lax'
      return
    }

    // 3. If visitor has active bypass cookie / storage, allow access
    if (
      localStorage.getItem('transact_geo_bypass') === 'true' ||
      document.cookie.includes('transact_geo_bypass=true')
    ) {
      return
    }

    // 4. INSTANT Zero-Latency Check: Pakistani Timezone Detection (0ms)
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (tz === 'Asia/Karachi') {
        sessionStorage.setItem('transact_visitor_country', 'PK')
        document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
        window.location.replace('/blocked')
        return
      }
    } catch {
      // Continue to network checks
    }

    // 5. Fast cached check in sessionStorage
    const cachedCountry = sessionStorage.getItem('transact_visitor_country')
    if (cachedCountry === 'PK') {
      window.location.replace('/blocked')
      return
    }
    if (cachedCountry && cachedCountry !== 'PK') {
      return
    }

    // 6. Network verification via server geo endpoint and fast CDN IP lookup
    const verifyCountry = async () => {
      try {
        const res = await fetch('/api/geo', { cache: 'no-store' }).catch(() => null)
        if (res && res.ok) {
          const data = await res.json()
          if (data.isBlocked || data.country === 'PK') {
            sessionStorage.setItem('transact_visitor_country', 'PK')
            document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
            window.location.replace('/blocked')
            return
          }
          if (data.country && data.country !== 'UNKNOWN' && data.country !== 'LOCAL' && data.country !== 'GLOBAL') {
            sessionStorage.setItem('transact_visitor_country', data.country)
            return
          }
        }

        const directRes = await fetch('https://api.country.is/', { cache: 'no-store' }).catch(() => null)
        if (directRes && directRes.ok) {
          const directData = await directRes.json()
          const code = (directData.country || '').toUpperCase()
          if (code === 'PK') {
            sessionStorage.setItem('transact_visitor_country', 'PK')
            document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
            window.location.replace('/blocked')
            return
          }
          if (code) {
            sessionStorage.setItem('transact_visitor_country', code)
          }
        }
      } catch (err) {
        console.warn('Geo check completed:', err)
      }
    }

    verifyCountry()
  }, [pathname])

  return null
}
