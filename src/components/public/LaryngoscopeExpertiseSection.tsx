'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  getStoredLaryngoscopeExpertise,
  LaryngoscopeExpertiseData,
} from '@/src/lib/dataStore'

export default function LaryngoscopeExpertiseSection() {
  const [data, setData] = useState<LaryngoscopeExpertiseData>(getStoredLaryngoscopeExpertise())
  const [activeTab, setActiveTab] = useState('Quality Control And Testing')

  const reloadData = () => {
    setData(getStoredLaryngoscopeExpertise())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  const steps = data.steps && data.steps.length > 0 ? data.steps : [
    'Raw Material Selection',
    'Stamping And Forging',
    'CNC Machining And Milling',
    'Fiber Optic Integration',
    'Grinding And Polishing',
    'Passivation And Sterilization',
    'Quality Control And Testing',
  ]

  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        {/* Top Pills Workflow Navigation */}
        <div className="flex items-center justify-start lg:justify-between gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <div className="bg-[#E9ECF0] p-1.5 rounded-full inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 min-w-max mx-auto shadow-inner">
            {steps.map((step) => {
              const isActive = activeTab === step
              return (
                <button
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#081022] text-[#F6851F] shadow-sm ring-1 ring-orange-500/30'
                      : 'text-[#4A5568] hover:text-[#081022] hover:bg-white/60'
                  }`}
                >
                  {step}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3-Column Visual & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Column 1 (Left): Text + 2 Stacked Photo Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            {/* Header Text Block */}
            <div className="space-y-3">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
                {data.eyebrow || 'LARYNGOSCOPE EXPERTISE'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#081022] tracking-tight leading-[1.15]">
                {data.title || 'BUILT FOR PRECISION & RELIABILITY'}
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6776] leading-relaxed">
                {data.description ||
                  'Our Manufacturing Expertise Combines Advanced Production Techniques, Skilled Craftsmanship, Quality Materials, And Rigorous Inspection To Create Instruments That Meet The Demanding Requirements Of Healthcare Professionals, Hospitals, Distributors, And Global Medical Brands.'}
              </p>
            </div>

            {/* Photo 1: Upper Left (Gloved packaging) */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/Rectangle 828.png"
                alt="Instrument Inspection & Packaging"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Photo 2: Lower Left (Gloved testing) */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/images/transact/image20_3812_2.jpg"
                alt="Instrument Assembly & Blade Fitting"
                fill
                unoptimized
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.src = '/Rectangle 828.png'
                }}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Column 2 (Center): Tall Hero Card */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] rounded-2xl overflow-hidden shadow-md border border-zinc-100 bg-zinc-900 group">
              <Image
                src="/Rectangle 827.png"
                alt="High-Intensity LED Optical Testing"
                fill
                unoptimized
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.src = '/images/transact/image10_3812_2.jpg'
                }}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-6 left-6 right-6 z-10 text-white space-y-2">
                <span className="inline-block px-3 py-1 rounded-full bg-[#F6851F] text-white text-[11px] font-bold tracking-wide">
                  Active Testing
                </span>
                <h3 className="text-lg sm:text-xl font-bold leading-snug drop-shadow-sm">
                  Full Optical &amp; Transmission Quality Verification
                </h3>
                <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                  Each fiber optic bundle is measured for maximum candela output and cryogenic endurance.
                </p>
              </div>
            </div>
          </div>

          {/* Column 3 (Right): 2 Stacked Photo Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            {/* Photo 3: Upper Right (Cleanroom inspection) */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/Rectangle 828.png"
                alt="ISO Certified Quality Inspection"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Photo 4: Lower Right (Drop forging & steel finishing) */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/images/manufacturing/process-01-cnc-machining.png"
                alt="Precision CNC Machining & Milling"
                fill
                unoptimized
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  target.src = '/Rectangle 827.png'
                }}
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
