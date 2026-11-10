'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Wrench,
  Clock,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

export default function UnderConstructionPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.title = 'Transact International | Website Under Construction'
  }, [])

  return (
    <div className="min-h-screen bg-[#081022] text-white flex flex-col justify-between selection:bg-[#F6851F] selection:text-white relative overflow-hidden font-sans">
      {/* Background Lighting Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#F6851F]/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 px-6 sm:px-12 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-40 sm:w-44 h-10">
            <Image
              src="/Asset 27 1.svg"
              alt="Transact International Logo"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Live Status Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="tracking-wide">System Upgrade in Progress</span>
        </div>
      </header>

      {/* Main Hero & Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12 sm:py-16 text-center space-y-10 my-auto">
        {/* Construction Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 uppercase tracking-widest backdrop-blur-sm shadow-inner">
          <Wrench className="w-3.5 h-3.5 text-[#F6851F]" />
          <span>Platform Development Phase</span>
        </div>

        {/* Headings */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Our Digital Platform Is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F6851F] via-orange-400 to-amber-300">
              Under Construction
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
            We are currently developing and upgrading our next-generation digital catalog,
            interactive product portfolios, and global instrument inquiry system.
            Our full web portal will be launching soon.
          </p>
        </div>

        {/* Progress & Milestone Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Architecture</span>
              </span>
              <span className="text-emerald-400">Complete</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              High-availability server infrastructure and global database deployment configured.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.04] border border-[#F6851F]/30 backdrop-blur-sm space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#F6851F]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <Clock className="w-4 h-4 text-[#F6851F]" />
                <span>Product Catalog</span>
              </span>
              <span className="text-[#F6851F]">In Progress</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              Precision surgical sets, laryngoscopes, and diagnostic tools data sync underway.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Quality Audit</span>
              </span>
              <span className="text-zinc-400">Scheduled</span>
            </div>
            <p className="text-xs text-zinc-400 leading-normal">
              ISO 13485:2016 &amp; CE certification compliance verification before public launch.
            </p>
          </div>
        </div>

        {/* Business Continuity & Inquiry Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.03] border border-white/15 backdrop-blur-md text-left space-y-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F6851F]" />
                <span>Manufacturing &amp; Export Operations Remain Fully Active</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                For urgent tender quotations, OEM private label manufacturing, or hospital orders:
              </p>
            </div>

            <a
              href="mailto:info@transact-intl.com?subject=Urgent%20Tender%20%2F%20Inquiry%20During%20Construction"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-lg shadow-[#F6851F]/20 shrink-0"
            >
              <Mail className="w-4 h-4" />
              <span>Send Direct Inquiry</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#F6851F] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Email</span>
                <a href="mailto:info@transact-intl.com" className="hover:text-white transition font-semibold">
                  info@transact-intl.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-4 h-4 text-[#F6851F] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Direct Phone / WhatsApp</span>
                <a href="tel:+923452626832" className="hover:text-white transition font-semibold">
                  (+92) 345-2626832
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#F6851F] shrink-0 mt-0.5" />
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-bold tracking-wider">Manufacturing Facility</span>
                <span className="font-semibold text-zinc-200">
                  Roras Road, Muzaffar Pur, Sialkot - 51310 Pakistan
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with Discrete Client & Staff Access */}
      <footer className="relative z-10 px-6 sm:px-12 py-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} Transact International. All Rights Reserved. ISO 13485 &amp; CE Certified.</p>

        <div className="flex items-center gap-4">
          <Link
            href="/preview"
            className="text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
          >
            <span>Client Preview Access</span>
            <ArrowRight className="w-3 h-3 text-[#F6851F]" />
          </Link>

          <span className="text-zinc-700">•</span>

          <Link
            href="/admin"
            className="text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
          >
            <Lock className="w-3 h-3 text-[#F6851F]" />
            <span>Staff Login</span>
          </Link>
        </div>
      </footer>
    </div>
  )
}
