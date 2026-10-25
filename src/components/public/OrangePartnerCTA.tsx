'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Globe, CheckCircle2, PhoneCall } from 'lucide-react'

export default function OrangePartnerCTA() {
  return (
    <section className="bg-[#F6851F] text-white py-16 sm:py-20 px-4 sm:px-8 relative overflow-hidden">
      {/* Decorative SVG Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,0 L100,100 M100,0 L0,100" stroke="white" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/15 text-white text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              Global B2B & OEM Manufacturing
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Partner with Transact International for Worldwide Surgical Instrument Supply
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              Whether you are a national healthcare distributor, hospital procurement group, or a specialized medical brand seeking precision contract manufacturing (OEM/ODM), Transact International delivers certified excellence on schedule.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm font-semibold text-white/95 pt-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-white text-[#F6851F]" />
                <span>Custom Laser Marking & Packaging</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-white text-[#F6851F]" />
                <span>ISO 13485 & CE Batch Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 fill-white text-[#F6851F]" />
                <span>Worldwide Air & Sea Freight Logistics</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3.5">
            <Link
              href="/contact"
              className="w-full py-4 px-6 bg-[#081022] hover:bg-[#0D3969] text-white text-center font-bold text-sm rounded-2xl transition shadow-2xl flex items-center justify-center gap-2 group hover:scale-[1.02]"
            >
              <span>Submit Institutional RFQ</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/catalogues"
              className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-[#081022] text-center font-bold text-sm rounded-2xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <span>Download Catalogues (PDF)</span>
            </Link>

            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-6 bg-black/20 hover:bg-black/30 text-white text-center font-semibold text-xs rounded-2xl transition border border-white/20 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Direct WhatsApp: +92 300 1234567</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
