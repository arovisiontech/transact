'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, ShoppingBag, ArrowUp, Phone } from 'lucide-react'
import { getQuoteCart } from '@/src/lib/dataStore'

interface FloatingContactCTAProps {
  onOpenQuote?: () => void
}

export default function FloatingContactCTA({ onOpenQuote }: FloatingContactCTAProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updateCount = () => {
      const cart = getQuoteCart()
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0))
    }
    updateCount()
    window.addEventListener('transact_data_updated', updateCount)
    return () => window.removeEventListener('transact_data_updated', updateCount)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <aside aria-label="Floating Contact & Quote Helper" className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full bg-white text-[#081022] shadow-lg border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 transition-all hover:scale-105"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* WhatsApp Fast Connect */}
      <a
        href="https://wa.me/923001234567?text=Hello%20Transact%20International,%20I%20would%20like%20to%20inquire%20about%20surgical%20instruments."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 transition-all"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
      </a>

      {/* Floating RFQ Quote Cart Badge */}
      {onOpenQuote && (
        <button
          onClick={onOpenQuote}
          aria-label="Open Quote Cart"
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#F6851F] hover:bg-[#E07314] text-white shadow-xl hover:scale-105 transition-all font-bold text-xs"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#081022] text-white text-[10px] font-extrabold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden sm:inline">RFQ Quote Cart</span>
        </button>
      )}
    </aside>
  )
}
