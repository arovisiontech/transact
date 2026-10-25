'use client'

import React from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { ShieldCheck, Award, ArrowRight, CheckCircle2, Factory, Globe } from 'lucide-react'

export default function BrandsPage() {
  const brandLines = [
    {
      name: 'Transact Surgical Precision™',
      desc: 'German & Japanese DIN grade stainless steel forceps, dissecting scissors, needle holders, retractors, and micro-instruments.',
      badge: 'Flagship Surgical Line',
    },
    {
      name: 'Transact Gold TC™ (Tungsten Carbide)',
      desc: 'Gold-plated ring needle holders and scissors with vacuum brazed tungsten carbide jaw inserts for ultra-fine needle grip.',
      badge: 'Premium Micro-Surgical',
    },
    {
      name: 'Transact Titanium Elite™',
      desc: 'Ultra-lightweight non-magnetic ophthalmic and neurosurgical titanium micro-forceps and needle drivers.',
      badge: 'Aerospace Grade Titanium',
    },
    {
      name: 'Transact Dental Pro™',
      desc: 'Complete dental extraction forceps, periodontal scalers, elevators, and composite restoration instruments.',
      badge: 'Clinical Dental Line',
    },
    {
      name: 'Transact Hospital Care™',
      desc: 'Seamless deep-drawn stainless steel surgical trays, kidney dishes, gallipots, and sterile autoclave containers.',
      badge: 'Hospital Hollowware',
    },
    {
      name: 'Transact OEM Private Label™',
      desc: 'Full-service contract manufacturing for international brand owners including custom laser marking and barcoding.',
      badge: 'OEM / Contract Supply',
    },
  ]

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Certified Product Classifications
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Transact International Product Lines & Brands
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Our specialized product divisions are engineered for distinct medical specialties, backed by verified metallurgy and ISO 13485 compliance.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brandLines.map((brand, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm transact-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <span className="px-3 py-1 rounded-full bg-[#FFF4EB] text-[#F6851F] text-[10px] font-bold uppercase tracking-wider inline-block">
                    {brand.badge}
                  </span>
                  <h2 className="text-xl font-bold text-[#081022]">
                    {brand.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                    {brand.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <Link href="/products" className="text-[#F6851F] font-bold flex items-center gap-1 hover:underline">
                    Explore Instruments <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* OEM Callout Box */}
          <div className="mt-14 p-8 sm:p-12 rounded-3xl bg-[#081022] text-white flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">OEM / ODM Manufacturing</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Need Custom Branding for Your Medical Line?</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                We manufacture private-label instruments for leading brands across North America, Europe, and Asia. Custom laser etching, batch color coding, and sterile pouching available.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-xl transition shadow-lg shrink-0"
            >
              Discuss OEM Partnership
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
