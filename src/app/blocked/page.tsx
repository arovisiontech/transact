'use client'

import { useEffect, useState } from 'react'

export default function GenericNotFoundPage() {
  const [host, setHost] = useState('server')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHost(window.location.hostname || 'server')
      document.title = '404 Not Found'
    }
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'sans-serif',
        padding: '24px 20px',
        margin: 0,
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: '0 0 12px 0' }}>
        404 Not Found
      </h1>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem' }}>
        The requested URL was not found on this server.
      </p>
      <hr style={{ border: 0, borderTop: '1px solid #cccccc', margin: '20px 0' }} />
      <address style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
        Apache Server at {host} Port 80
      </address>
    </div>
  )
}
