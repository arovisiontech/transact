'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default function DiagnosticShowcaseSection() {
  const highlights = [
    {
      icon: '/LED Illumination-icon 1.svg',
      title: 'Cool LED Illumination',
      desc: 'High-intensity daylight fiber optics provide 3.5V true-tissue illumination with zero heat emission.',
    },
    {
      icon: '/Batteries-icon 1.svg',
      title: 'Power & Rechargeable Bases',
      desc: 'Dual-purpose knurled brass handles compatible with standard alkaline and fast-charge Li-ion cells.',
    },
  ]

  return (
    <section className="py-20 2xl:py-28 px-4 sm:px-8 bg-[#FAFAFC] border-t border-zinc-200">
      <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl 2xl:max-w-3xl">
            <span className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-3.5 py-1 rounded-full border border-[#F6851F]/30">
              Diagnostic & Anesthesia Engineering
            </span>
            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
              Anesthesia Laryngoscopes & Clinical Diagnostics
            </h2>
            <p className="text-sm 2xl:text-base text-[#4B5D71]">
              Engineered with German optical standards, our fiber optic laryngoscopes and diagnostic sets provide crystal-clear visual clarity during critical airway management.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold text-[#F6851F] hover:text-[#E07314] transition shrink-0 group cursor-pointer"
          >
            <span>Explore Diagnostic Range</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Dual Specialty Banner Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Laryngoscope Blade Series */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#081022] to-[#05163F] text-white relative overflow-hidden shadow-xl border border-white/10 flex flex-col justify-between">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F6851F] bg-[#F6851F]/20 px-3 py-1 rounded-full border border-[#F6851F]/40">
                Fiber Optic Macintosh & Miller
              </span>
              <h3 className="text-2xl 2xl:text-3xl font-black text-white leading-snug">
                Surgical Laryngoscope Sets & Integrated Blades
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Removable fiber optic light pipes, autoclave-safe stainless steel blades, and seamless atraumatic edges designed for emergency intubation and anesthesiology.
              </p>

              <div className="pt-2">
                <Link
                  href="/products?category=anesthesia"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-lg shadow-[#F6851F]/25 cursor-pointer"
                >
                  <span>View Laryngoscope Series</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic Image */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-4 lg:bottom-4 w-48 sm:w-60 h-48 sm:h-60 relative opacity-90 hover:scale-105 transition-transform duration-500 self-end">
              <Image
                src="/laryngoscope 2.svg"
                alt="Fiber Optic Laryngoscope Set"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Card 2: Clinical Diagnostics Array */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#081022] to-[#0D3969] text-white relative overflow-hidden shadow-xl border border-white/10 flex flex-col justify-between">
            <div className="relative z-10 space-y-4 max-w-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F6851F] bg-[#F6851F]/20 px-3 py-1 rounded-full border border-[#F6851F]/40">
                Examination & ENT Sets
              </span>
              <h3 className="text-2xl 2xl:text-3xl font-black text-white leading-snug">
                Clinical Diagnostics & Examination Instruments
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Precision otoscopes, ophthalmoscopes, neurological tuning forks, and percussion hammers designed with balanced mass distribution and ergonomic touch.
              </p>

              <div className="pt-2">
                <Link
                  href="/products?category=diagnostics"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 text-xs font-bold transition cursor-pointer"
                >
                  <span>Explore Diagnostic Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Graphic Image */}
            <div className="mt-6 lg:mt-0 lg:absolute lg:right-4 lg:bottom-4 w-48 sm:w-60 h-48 sm:h-60 relative opacity-90 hover:scale-105 transition-transform duration-500 self-end">
              <Image
                src="/Diagnostics 2.svg"
                alt="Clinical Diagnostic Set"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>

        {/* Feature Technology Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#FFF4EB] border border-[#F6851F]/20 p-2.5 flex items-center justify-center shrink-0">
                <Image
                  src={h.icon}
                  alt={h.title}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-[#081022]">{h.title}</h4>
                <p className="text-xs 2xl:text-sm text-[#4B5D71] leading-relaxed">
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
