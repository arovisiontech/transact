'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getStoredGlobalPartner, GlobalPartnerData } from '@/src/lib/dataStore'

export default function GlobalPartnerSection() {
  const [data, setData] = useState<GlobalPartnerData>(getStoredGlobalPartner())

  const reloadData = () => {
    setData(getStoredGlobalPartner())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  return (
    <section className="bg-[#F4F7FB] py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Text, Stats, and Pill CTA */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
                {data.eyebrow || 'GLOBAL B2B PARTNERSHIP'}
              </span>
              <div className="w-12 h-[2px] bg-[#081022] mt-1.5" />
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#081022] tracking-tight leading-[1.15]">
              {data.title ? (
                <>
                  Your Reliable Medical{' '}
                  <span className="text-[#F6851F] block sm:inline">
                    {data.title_highlight || 'Instrument Partner'}
                  </span>
                </>
              ) : (
                'Your Reliable Medical Instrument Partner'
              )}
            </h2>

            {/* Subtitle Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-[#5B6776] leading-relaxed max-w-xl">
              <p>
                {data.paragraph_1 ||
                  'Transact Works With Healthcare Distributors, Hospitals, Medical Companies And Global Brands Seeking Dependable Laryngoscope Solutions.'}
              </p>
              <p>
                {data.paragraph_2 ||
                  'With 50+ Countries Of Global Presence And 150+ Dedicated Professionals, We Offer Flexible OEM / Private Label Opportunities Tailored To Your Requirements.'}
              </p>
            </div>

            {/* 3 Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-2 border-y border-zinc-200/60 sm:border-none">
              {(data.metrics || []).map((m, idx) => {
                const defaultIcon =
                  idx === 0
                    ? '/Global Presence-icon 2.svg'
                    : idx === 1
                    ? '/Worker-icon 1.svg'
                    : '/Asset 27 1.svg'
                const iconSrc = m.icon || defaultIcon

                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-zinc-100">
                      <Image
                        src={iconSrc}
                        alt={m.label}
                        width={36}
                        height={36}
                        unoptimized
                        className="object-contain"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement
                          if (!target.src.includes(defaultIcon)) {
                            target.src = defaultIcon
                          }
                        }}
                      />
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-black text-[#081022] leading-none">
                        {m.value}
                      </div>
                      <div className="text-[11px] sm:text-xs text-[#5B6776] font-medium mt-1 leading-tight whitespace-pre-line">
                        {m.label}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Wide Orange Pill CTA Button */}
            <div className="pt-2">
              <Link
                href={data.primary_btn_link || '/contact'}
                className="inline-flex items-center justify-center flex-wrap px-6 sm:px-8 py-3.5 rounded-full bg-[#F6851F] hover:bg-[#E07312] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 text-center"
              >
                <span>{data.primary_btn_text || 'Request Your Product'}</span>
                <span className="mx-2.5 opacity-60">|</span>
                <span>{data.tag_1 || 'OEM / Private Label'}</span>
                <span className="mx-2.5 opacity-60">|</span>
                <span>{data.tag_2 || 'Global Distribution'}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Product Showcase Illustration */}
          <div className="lg:col-span-6 xl:col-span-6 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-white border-4 border-white">
              <Image
                src="/image 353.svg"
                alt="Transact Global B2B Partnership"
                fill
                unoptimized
                priority
                className="object-contain p-4 hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement
                  if (!target.src.includes('image-353.svg')) {
                    target.src = '/image-353.svg'
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
