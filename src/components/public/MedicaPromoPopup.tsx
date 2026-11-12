'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Calendar, MapPin, ArrowRight, Sparkles } from 'lucide-react'

export default function MedicaPromoPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [imgSrc, setImgSrc] = useState('/images/events/medica-2026.jpg')

  useEffect(() => {
    // Check if dismissed in this session
    const dismissed = sessionStorage.getItem('transact_medica_popup_dismissed')
    // Open smoothly after initial page load (700ms delay for premium entrance)
    const timer = setTimeout(() => {
      if (!dismissed) {
        setIsRendered(true)
        // Give time for DOM insertion before animating in
        requestAnimationFrame(() => setIsOpen(true))
      }
    }, 700)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem('transact_medica_popup_dismissed', 'true')
    setTimeout(() => setIsRendered(false), 350)
  }

  const handleManualOpen = () => {
    setIsRendered(true)
    requestAnimationFrame(() => setIsOpen(true))
  }

  return (
    <>
      {/* ── Main Animated Popup Modal ── */}
      {isRendered && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Medica 2026 Invitation"
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 transition-all duration-300 ${
            isOpen
              ? 'opacity-100 bg-black/85 backdrop-blur-md'
              : 'opacity-0 bg-black/0 pointer-events-none'
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose()
          }}
        >
          <div
            className={`relative w-full max-w-[540px] max-h-[94vh] flex flex-col rounded-3xl overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#0A0E1A] to-black border border-white/20 shadow-[0_25px_90px_rgba(0,0,0,0.85)] ring-1 ring-orange-500/30 transition-all duration-500 transform ${
              isOpen
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-90 opacity-0 translate-y-6'
            }`}
          >
            {/* Top Decorative Ambient Glow Bar */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600 z-30" />

            {/* Top Bar with Badge and Close Button */}
            <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3.5 bg-black/40 backdrop-blur-md border-b border-white/10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/40 text-orange-400 text-[11px] sm:text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
                <span>OFFICIAL INVITATION • MEDICA 2026</span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close popup"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable / Scaled Poster Content */}
            <div className="overflow-y-auto max-h-[calc(94vh-120px)] scrollbar-none p-3 sm:p-5 flex flex-col items-center">
              {/* Image Frame with Glow */}
              <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white shadow-2xl border-2 border-white/90 group">
                <Image
                  src={imgSrc}
                  alt="Transact International - Medica 2026 Düsseldorf Germany Invitation"
                  fill
                  priority
                  unoptimized
                  onError={() => {
                    if (imgSrc !== '/Medica.jpg') {
                      setImgSrc('/Medica.jpg')
                    }
                  }}
                  className="object-contain bg-white transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              {/* Event Quick Info Strip */}
              <div className="w-full mt-3.5 grid grid-cols-2 gap-2 text-white/90 text-xs font-semibold">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <Calendar className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">16–19 Nov 2026</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="truncate">Hall 16, Booth G67-20</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="relative z-20 px-4 sm:px-6 py-3.5 bg-black/60 backdrop-blur-md border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <Link
                href="/contact?subject=Meet+at+Medica+2026"
                onClick={handleClose}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#F6851F] hover:bg-[#e07516] text-white text-xs sm:text-sm font-bold shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <span>Book a Meeting with Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-white/60 hover:text-white transition-colors cursor-pointer text-center"
              >
                Continue to Website
              </button>
            </div>
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
          <span className="hidden sm:inline text-white/80 font-normal">| Hall 16, G67-20</span>
        </button>
      )}
    </>
  )
}
