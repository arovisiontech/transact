'use client'

import React, { useState, Suspense } from 'react'
import PublicHeader from './PublicHeader'
import PublicFooter from './PublicFooter'
import PublicSearchModal from './PublicSearchModal'
import CartQuoteModal from './CartQuoteModal'
import FloatingContactCTA from './FloatingContactCTA'

interface PublicShellProps {
  children: React.ReactNode
}

export default function PublicShell({ children }: PublicShellProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isQuoteOpen, setIsQuoteOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#081022]">
      {/* Header */}
      <Suspense fallback={<header className="h-24 bg-[#081022] border-b border-zinc-800" />}>
        <PublicHeader
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenQuote={() => setIsQuoteOpen(true)}
        />
      </Suspense>

      {/* Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <PublicFooter />

      {/* Modals & Floating Helpers */}
      <PublicSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CartQuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
      />

      <FloatingContactCTA
        onOpenQuote={() => setIsQuoteOpen(true)}
      />
    </div>
  )
}
