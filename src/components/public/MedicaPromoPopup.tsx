'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'

// Flag to ensure auto-popup only triggers on 1st time site load or browser refresh (F5), NOT on page navigation
let hasAutoOpenedOnPageLoad = false

export default function MedicaPromoPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [imgSrc, setImgSrc] = useState('/images/events/medica-2026.jpg')

  useEffect(() => {
    // Only open on initial site open or page refresh. Do NOT show when navigating to new pages.
    if (!hasAutoOpenedOnPageLoad) {
      hasAutoOpenedOnPageLoad = true
      const timer = setTimeout(() => {
        setIsRendered(true)
        requestAnimationFrame(() => {
          setTimeout(() => setIsOpen(true), 50)
        })
      }, 350)

      return () => clearTimeout(timer)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(() => setIsRendered(false), 450)
  }

  const handleManualOpen = () => {
    setIsRendered(true)
    requestAnimationFrame(() => {
      setTimeout(() => setIsOpen(true), 50)
    })
  }

  return (
    <>
      {/* ── Main Pure Image Animated Popup Modal ── */}
      {isRendered && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Medica 2026 Exhibition Invitation"
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 transition-all duration-700 ease-out ${
            isOpen
              ? 'opacity-100 bg-black/85 backdrop-blur-xl'
              : 'opacity-0 bg-black/0 pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          {/* Animated Card Container: Pure Image with Ultra-Smooth Premium Zoom In */}
          <div
            className={`relative w-full max-w-[480px] rounded-3xl overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.9),0_0_60px_rgba(246,133,31,0.3)] border-2 border-white/30 ring-1 ring-orange-500/50 bg-white transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
              isOpen
                ? 'scale-100 opacity-100 translate-y-0 blur-0'
                : 'scale-[0.70] opacity-0 translate-y-8 blur-[3px]'
            }`}
          >
            {/* Top-Right Floating Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close invitation"
              className="absolute top-3.5 right-3.5 z-30 w-9 h-9 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md border border-white/30 shadow-2xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Pure Flyer Image (Clickable Link to Contact) */}
            <Link
              href="/contact?subject=Meet+at+Medica+2026+Dusseldorf"
              onClick={handleClose}
              title="Click to book a meeting at MEDICA 2026"
              className="block relative w-full aspect-[4/5] bg-white cursor-pointer group overflow-hidden"
            >
              <Image
                src={imgSrc}
                alt="Transact International - Medica 2026 Düsseldorf Germany Exhibition Invitation"
                fill
                priority
                unoptimized
                onError={() => {
                  if (imgSrc !== '/Medica.jpg') {
                    setImgSrc('/Medica.jpg')
                  }
                }}
                className="object-contain bg-white transition-transform duration-700 group-hover:scale-[1.01]"
              />
            </Link>
          </div>
        </div>
      )}

      {/* ── Floating Pill to Re-open Medica 2026 Invitation anytime ── */}
      {!isRendered && (
        <button
          type="button"
          onClick={handleManualOpen}
          aria-label="View Medica 2026 Invitation"
          className="fixed bottom-5 left-5 z-[80] group flex items-center gap-2.5 px-3.5 sm:px-4 py-2 rounded-full bg-[#081022]/95 hover:bg-[#081022] text-white text-xs font-bold shadow-xl border border-orange-500/40 backdrop-blur-md transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/20 cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="text-orange-400">MEDICA 2026</span>
          <span className="hidden sm:inline text-white/80 font-normal">| Hall 16, Booth G67-20</span>
        </button>
      )}
    </>
  )
}
