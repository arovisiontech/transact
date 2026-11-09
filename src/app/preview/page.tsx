'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SecretPreviewPage() {
  const router = useRouter()
  const [activated, setActivated] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Activate bypass cookie and local storage for 1 year
      document.cookie = 'transact_geo_bypass=true; path=/; max-age=31536000; SameSite=Lax'
      localStorage.setItem('transact_geo_bypass', 'true')

      // 2. Clear any blocked cache
      sessionStorage.removeItem('transact_visitor_country')

      setActivated(true)

      // 3. Immediate smooth redirect to home page
      const timer = setTimeout(() => {
        window.location.href = '/'
      }, 600)

      return () => clearTimeout(timer)
    }
  }, [router])

  return (
    <div
      style={{
        backgroundColor: '#081022',
        color: '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          backgroundColor: '#0e1830',
          padding: '36px 28px',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            color: '#ffffff',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            marginBottom: '16px',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
          Private Preview Activated
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px 0', lineHeight: 1.5 }}>
          Your browser is now authorized. Opening website...
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#F6851F',
            color: '#ffffff',
            padding: '12px 28px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 'bold',
            textDecoration: 'none',
          }}
        >
          Enter Website →
        </a>
      </div>
    </div>
  )
}
