'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getStoredTrustFeatures, TrustFeaturesData } from '@/src/lib/dataStore'

export default function TrustFeaturesSection() {
  const [data, setData] = useState<TrustFeaturesData>(getStoredTrustFeatures())

  const reloadData = () => {
    setData(getStoredTrustFeatures())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  const features = data.features || []

  return (
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-8 border-b border-zinc-100">
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* ── Centered Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Eyebrow with two horizontal orange lines */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 sm:w-12 h-0.5 bg-[#F6851F] rounded-full" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#F6851F]">
              {data.eyebrow || 'Built For Safety. Designed For Excellence.'}
            </span>
            <span className="w-8 sm:w-12 h-0.5 bg-[#F6851F] rounded-full" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
            {data.title || 'Quality You Can Trust, Every Time'}
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed max-w-xl mx-auto">
            {data.subtitle ||
              'From Raw Material To Final Inspection – Every Step Is Controlled, So You Can Focus On What Matters Most: Your Patients'}
          </p>
        </div>

        {/* ── 5 Cards in a Responsive Row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#FAFAFC] hover:bg-white rounded-2xl p-6 border border-zinc-200/70 hover:border-orange-300 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group space-y-4"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 rounded-xl bg-white border border-zinc-200/80 shadow-xs flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={item.icon || '/reusable-grade 1.svg'}
                  alt={item.title}
                  width={34}
                  height={34}
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* Title & Description */}
              <div className="space-y-2 flex-1">
                <h4 className="text-sm sm:text-base font-black text-[#081022] leading-snug group-hover:text-[#F6851F] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-[#5C6F84] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Orange Dash */}
              <div className="w-6 h-0.5 bg-orange-400/40 group-hover:w-10 group-hover:bg-[#F6851F] transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
