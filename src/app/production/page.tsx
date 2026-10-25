'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  ChevronRight,
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
} from 'lucide-react'
import { ManufacturingData } from '@/src/types'
import initialManufacturing from '@/src/data/manufacturing.json'

export default function ProductionPage() {
  const [data, setData] = useState<ManufacturingData>(initialManufacturing as unknown as ManufacturingData)

  useEffect(() => {
    fetch('/api/manufacturing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.hero) setData(res)
      })
      .catch(() => {})
  }, [])

  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (Dark Navy with image 333.svg & Breadcrumbs) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-[#081022] text-white overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F36C21]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 pt-8 pb-16 lg:py-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-8 font-medium">
            <Link href="/" className="hover:text-white transition">
              Home
            </Link>
            <span className="text-zinc-600">/</span>
            <Link href="/about" className="hover:text-white transition">
              Quality
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-[#F36C21] font-bold">Manufacturing Process</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-[#F36C21] tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{data.hero.badge || 'OUR MANUFACTURING CAPABILITIES'}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                {data.hero.title || 'Precision Manufacturing Process'}
              </h1>

              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
                {data.hero.subtitle ||
                  'From raw medical-grade materials to precision-engineered surgical instruments, discover our state-of-the-art facility.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href="#production-process"
                  className="px-8 py-3.5 bg-[#F36C21] hover:bg-[#E05B13] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>Explore Process</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-bold rounded-xl border border-white/20 transition"
                >
                  Contact Engineering Team
                </Link>
              </div>
            </div>

            {/* Right Hero Visual (image 333.svg) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
                <Image
                  src={data.hero.hero_image || '/image 333.svg'}
                  alt="Transact Manufacturing Video Laryngoscope"
                  fill
                  priority
                  unoptimized
                  className="object-contain p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. SECTION 1: BUILT FOR ACCURACY, RELIABILITY & PERFORMANCE  */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 space-y-16">
          {/* Top 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F36C21]">
                  {data.intro.tagline || 'HIGH-QUALITY SOLUTIONS'}
                </span>
                <span className="h-0.5 w-12 bg-[#F36C21]" />
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0A1328] tracking-tight leading-tight">
                {data.intro.heading || 'Built For Accuracy, Reliability And Long-Term Performance.'}
              </h2>
            </div>

            <div className="lg:col-span-6 lg:border-l-2 lg:border-slate-200 lg:pl-10">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {data.intro.description ||
                  'Our Production Halls Bring Together Experienced Professionals, Carefully Selected Manufacturing Materials And Controlled Processes To Create Surgical Instruments For Demanding Clinical Environments. Every Order Is Handled With Attention To Craftsmanship, Functional Performance And Secure Delivery Preparation.'}
              </p>
            </div>
          </div>

          {/* 4 Feature Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {data.intro.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#FAFAFC] border border-slate-200/80 hover:border-[#F36C21]/40 hover:shadow-md transition group"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#FFF4EB] border border-[#F36C21]/20 flex items-center justify-center shrink-0 p-2.5 transition group-hover:scale-105">
                  <Image
                    src={pillar.icon || '/quality-icon 1 (1).svg'}
                    alt={pillar.title}
                    width={36}
                    height={36}
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0A1328] leading-snug">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-[#F36C21] font-semibold mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. SECTION 2: WORKFLOW PROCESS (6 CARDS GRID)               */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#FAF7F2] py-16 sm:py-24 border-b border-[#F0EAE1]">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          {/* Section Header */}
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F36C21]">
                {data.workflow.tagline || 'FROM MATERIAL TO INSTRUMENT'}
              </span>
              <span className="h-0.5 w-12 bg-[#F36C21]" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#F36C21] tracking-tight leading-tight">
              {data.workflow.heading || 'A Production Process Designed Around Precision.'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {data.workflow.subheading ||
                'Each Stage Is Planned To Help Us Deliver Dependable Surgical Instruments With Consistent Fit, Finish And Function.'}
            </p>
          </div>

          {/* 6 Workflow Cards (2 Rows x 3 Cols) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {data.workflow.cards.map((card) => (
              <div
                key={card.id || card.step}
                className="bg-white rounded-2xl p-7 border border-[#EFE8DF] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-6 group hover:-translate-y-1"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{card.step}</span>
                    <span className="h-0.5 w-8 bg-[#F36C21]" />
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-[#FFF4EB] flex items-center justify-center p-2 border border-[#F36C21]/20 group-hover:scale-110 transition-transform">
                    <Image
                      src={card.icon || '/Inspection Process-icon 1.svg'}
                      alt={card.title}
                      width={32}
                      height={32}
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#F36C21] tracking-wide">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. SECTION 3: PHOTO-RICH PROCESS (SLICED FROM IMAGE 416)     */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section id="production-process" className="bg-white py-16 sm:py-24 border-b border-slate-200">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          {/* Section Header with Counter */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-slate-100 pb-8">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F36C21]">
                  {data.production_steps.tagline || 'OUR PRODUCTION PROCESS'}
                </span>
                <span className="h-0.5 w-12 bg-[#F36C21]" />
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1328] tracking-tight leading-tight">
                {data.production_steps.heading || 'From Raw Materials To Precision-Crafted Instruments.'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {data.production_steps.description ||
                  'Every Step Is Carefully Managed By Our Skilled Team, Using Advanced Technology And Strict Quality Control To Deliver Reliable Surgical Instruments Worldwide.'}
              </p>
            </div>

            <div className="lg:col-span-4 flex lg:justify-end items-center">
              <span className="text-2xl sm:text-3xl font-serif italic text-slate-400">
                {data.production_steps.counter || '01 — 06'}
              </span>
            </div>
          </div>

          {/* Top Row: 2 Large Photo Cards (CNC Machining & Forging) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {data.production_steps.steps.slice(0, 2).map((step, idx) => (
              <div
                key={step.id || step.step}
                className={`${
                  idx === 0 ? 'lg:col-span-7' : 'lg:col-span-5'
                } bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group`}
              >
                {/* Photo Area */}
                <div className="relative w-full aspect-[16/7] bg-slate-900 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Card Text Footer */}
                <div className="p-6 sm:p-7 flex items-center justify-between gap-4 flex-1">
                  <div className="flex items-start gap-4">
                    <span className="text-xl sm:text-2xl font-serif italic font-bold text-[#8A2424]">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-base sm:text-lg font-bold text-[#8A2424]">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#8A2424] shadow-xs shrink-0 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row: 4 Photo Cards (Turning, QC, Laser, Packaging) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.production_steps.steps.slice(2).map((step) => (
              <div
                key={step.id || step.step}
                className="bg-[#FAF7F2] rounded-3xl overflow-hidden border border-[#EFE8DF] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo Area */}
                <div className="relative w-full aspect-[16/10] bg-slate-900 overflow-hidden">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Card Text Footer */}
                <div className="p-5 flex items-start justify-between gap-3 flex-1">
                  <div className="flex items-start gap-3">
                    <span className="text-lg font-serif italic font-bold text-[#8A2424]">
                      {step.step}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-[#8A2424] leading-snug">
                        {step.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#8A2424] shadow-xs shrink-0 group-hover:translate-x-1 transition-transform mt-0.5">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. SECTION 4: THE TRANSACT MEDICAL STANDARD (Orange Section) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-[#F36C21] py-16 sm:py-24 text-white">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 space-y-12">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                {data.standards.tagline || 'THE TRANSACT MEDICAL STANDARD'}
              </span>
              <span className="h-0.5 w-12 bg-white/60" />
            </div>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl">
              {data.standards.heading || 'Care At Every Stage Of The Manufacturing Journey.'}
            </h2>
          </div>

          {/* 4 Glass Outlined Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.standards.cards.map((std) => (
              <div
                key={std.id || std.step}
                className="bg-white/10 backdrop-blur-xs border border-white/30 rounded-2xl p-7 space-y-4 hover:bg-white/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{std.step}</span>
                    <span className="h-0.5 w-8 bg-white/80" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider leading-snug">
                    {std.title}
                  </h3>
                </div>
                <p className="text-xs text-white/90 leading-relaxed font-normal">
                  {std.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 6. SECTION 5: CTA BANNER                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="relative bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-slate-200 overflow-hidden shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Orange Left Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#F36C21]" />

            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {data.cta.tagline || "LET'S START A CONVERSATION"}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0A1328] tracking-tight leading-tight">
                {data.cta.heading || 'Need Help Finding The'}{' '}
                <span className="text-[#F36C21]">{data.cta.highlight || 'Right Instruments?'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {data.cta.description ||
                  'Tell Us Your Product Requirements, Quantity And Destination. Our Team Will Guide You To The Right Next Step.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href={data.cta.email_link || 'mailto:info@transactintl.com'}
                className="px-8 py-3.5 bg-[#F36C21] hover:bg-[#E05B13] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5 inline-flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{data.cta.email_text || 'Email Sale'}</span>
              </a>
              <a
                href={data.cta.whatsapp_link || 'https://wa.me/923452626832'}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-3.5 bg-white hover:bg-slate-50 text-[#F36C21] border border-[#F36C21] text-xs sm:text-sm font-bold rounded-xl shadow-xs transition inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{data.cta.whatsapp_text || 'WhatsApp'}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
