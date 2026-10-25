'use client'

import React, { useState } from 'react'
import Image from 'next/image'

const PROCESS_STEPS = [
  'Raw Material Selection',
  'Stamping And Forging',
  'CNC Machining And Milling',
  'Fiber Optic Integration',
  'Grinding And Polishing',
  'Passivation And Sterilization',
  'Quality Control And Testing',
]

export default function LaryngoscopeExpertiseSection() {
  const [activeTab, setActiveTab] = useState('Quality Control And Testing')

  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        {/* Top Pills Workflow Navigation */}
        <div className="flex items-center justify-start lg:justify-between gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          <div className="bg-[#E9ECF0] p-1.5 rounded-full inline-flex flex-wrap sm:flex-nowrap items-center gap-1.5 min-w-max mx-auto shadow-inner">
            {PROCESS_STEPS.map((step) => {
              const isActive = activeTab === step
              return (
                <button
                  key={step}
                  onClick={() => setActiveTab(step)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-xs font-bold transition-all duration-200 whitespace-nowrap ${
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

        {/* 3-Column Visual & Content Grid matching Screenshot 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">
          {/* Column 1 (Left): Text + 2 Stacked Photo Cards */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5">
            {/* Header Text Block */}
            <div className="space-y-3">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
                LARYNGOSCOPE EXPERTISE
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-[#081022] tracking-tight leading-[1.15]">
                BUILT FOR PRECISION{' '}
                <span className="text-[#F6851F] block">
                  & RELIABILITY
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6776] leading-relaxed">
                Our Manufacturing Expertise Combines Advanced Production Techniques, Skilled Craftsmanship, Quality Materials, And Rigorous Inspection To Create Instruments That Meet The Demanding Requirements Of Healthcare Professionals, Hospitals, Distributors, And Global Medical Brands.
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
                src="/Rectangle 828.png"
                alt="Instrument Assembly & Blade Fitting"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Column 2 (Center): Tall Drop-Forging Press + CAD Computer Terminal */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-5">
            {/* Photo 3: Drop Forging Press (Tall) */}
            <div className="relative w-full aspect-[337/505] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group flex-1">
              <Image
                src="/Rectangle 823.svg"
                alt="Stamping and Drop Forging"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Photo 4: Worker at CAD Terminal with Transact logo */}
            <div className="relative w-full aspect-[327/320] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/Rectangle 827.png"
                alt="Computer Aided Quality Calibration"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Column 3 (Right): Worker Packing Boxed Sets + Laryngoscope Blade on CNC */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            {/* Photo 5: Worker Packing Boxed Sets */}
            <div className="relative w-full aspect-[670/363] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group">
              <Image
                src="/Rectangle 824.svg"
                alt="Final Case Packing & Rigorous Inspection"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Photo 6: CNC Machined Blade with laser marking */}
            <div className="relative w-full aspect-[680/487] rounded-2xl overflow-hidden shadow-sm border border-zinc-100 bg-zinc-50 group flex-1">
              <Image
                src="/Rectangle 826.svg"
                alt="CNC Machined Laryngoscope Blade on Inspection Fixture"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
