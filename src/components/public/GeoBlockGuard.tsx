'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function GeoBlockGuard() {
  const pathname = usePathname()
  const [isBlocked, setIsBlocked] = useState(false)
  const [hostname, setHostname] = useState('server')

  useEffect(() => {
    // 1. Never block admin or secret preview routes
    if (
      !pathname ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/preview') ||
      pathname.startsWith('/secret-preview') ||
      pathname.startsWith('/access') ||
      pathname === '/blocked'
    ) {
      return
    }

    if (typeof window === 'undefined') return

    setHostname(window.location.hostname || 'server')

    // 2. Check for secret preview bypass in URL (e.g. ?preview=1 or ?bypass_geo=transact or ?secret=transact)
    const params = new URLSearchParams(window.location.search)
    const bypassParam = params.get('bypass_geo') || params.get('preview') || params.get('secret')
    if (
      bypassParam === 'transact' ||
      bypassParam === 'transact2026' ||
      bypassParam === '1' ||
      bypassParam === 'true'
    ) {
      localStorage.setItem('transact_geo_bypass', 'true')
      document.cookie = 'transact_geo_bypass=true; path=/; max-age=2592000'
      return
    }

    // 3. If visitor has active bypass cookie / storage, allow access
    if (
      localStorage.getItem('transact_geo_bypass') === 'true' ||
      document.cookie.includes('transact_geo_bypass=true')
    ) {
      return
    }

    // 4. Check if admin disabled regional blocking in settings
    if (
      localStorage.getItem('transact_block_pk') === 'false' ||
      document.cookie.includes('transact_block_pk=false')
    ) {
      return
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

    // 6. Verification check via server /api/geo & secondary IP lookup
    const verifyCountry = async () => {
      try {
        const res = await fetch('/api/geo', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data.isBlocked || data.country === 'PK') {
            sessionStorage.setItem('transact_visitor_country', 'PK')
            document.cookie = 'transact_visitor_country=PK; path=/; max-age=86400'
            window.location.replace('/blocked')
            return
          }
          if (data.country && data.country !== 'UNKNOWN' && data.country !== 'LOCAL') {
            sessionStorage.setItem('transact_visitor_country', data.country)
            return
          }
        }

        // Secondary direct IP lookup fallback
        const directRes = await fetch('https://api.country.is/', { cache: 'no-store' })
        if (directRes.ok) {
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
        console.warn('Geo-verification check completed:', err)
      }
    }

    verifyCountry()
  }, [pathname])

  return null
}
