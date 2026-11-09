'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldAlert, Globe, Mail, ArrowRight, Lock } from 'lucide-react'

export default function AccessRestrictedPage() {
  return (
    <div className="min-h-screen bg-[#081022] text-white flex flex-col justify-between selection:bg-[#F6851F] selection:text-white relative overflow-hidden">
      {/* Background Subtle Gradient & Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#F6851F]/10 rounded-full blur-[120px]" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-8 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10">
            <Image
              src="/Vector (4).svg"
              alt="Transact International Logo"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-wider uppercase text-white block leading-tight">
              Transact
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#F6851F] uppercase block">
              International
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-zinc-300">
          <Globe className="w-3.5 h-3.5 text-[#F6851F]" />
          <span>Global B2B Export Portal</span>
        </div>
      </header>

      {/* Main Restriction Notice Body */}
      <main className="relative z-10 max-w-2xl mx-auto px-6 py-12 sm:py-20 text-center space-y-8 my-auto">
        {/* Warning Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/20 animate-pulse">
            <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <span className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-md">
            403 Forbidden
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Regional Access Restricted
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 font-medium">
            This digital catalog and instrument ordering service is currently not available in your region (<strong className="text-white">Pakistan</strong>).
          </p>
        </div>

        {/* Detailed Explanation Card */}
        <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-left space-y-3 text-xs sm:text-sm text-zinc-400 leading-relaxed backdrop-blur-sm">
          <p>
            Transact International manufacturing facilities operate strictly for international distributors, OEM private label partners, and hospital groups across Europe, the Americas, Asia-Pacific, and the Middle East.
          </p>
          <p>
            In accordance with regional trade distribution agreements and export policy, direct public browsing from domestic network addresses within Pakistan has been restricted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href="mailto:info@transactintl.com?subject=International%20Distribution%20Inquiry"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow-lg shadow-[#F6851F]/20 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Export Division</span>
          </a>

          <Link
            href="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold transition border border-white/10 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-[#F6851F]" />
            <span>Administrator Sign-In</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-white/10 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Transact International. All Rights Reserved. ISO 13485 &amp; CE Certified Medical Instruments.</p>
      </footer>
    </div>
  )
}
