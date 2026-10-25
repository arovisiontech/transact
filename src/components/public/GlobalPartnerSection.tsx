'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function GlobalPartnerSection() {
  return (
    <section className="bg-[#F4F7FB] py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Text, Stats, and Pill CTA */}
          <div className="lg:col-span-6 xl:col-span-6 space-y-6">
            {/* Eyebrow */}
            <div className="inline-block">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
                GLOBAL B2B PARTNERSHIP
              </span>
              <div className="w-12 h-[2px] bg-[#081022] mt-1.5" />
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#081022] tracking-tight leading-[1.15]">
              Your Reliable Medical{' '}
              <span className="text-[#F6851F] block sm:inline">
                Instrument Partner
              </span>
            </h2>

            {/* Subtitle Paragraphs */}
            <div className="space-y-3 text-xs sm:text-sm text-[#5B6776] leading-relaxed max-w-xl">
              <p>
                Transact Works With Healthcare Distributors, Hospitals, Medical Companies And Global Brands Seeking Dependable Laryngoscope Solutions.
              </p>
              <p>
                With 50+ Countries Of Global Presence And 150+ Dedicated Professionals, We Offer Flexible OEM / Private Label Opportunities Tailored To Your Requirements.
              </p>
            </div>

            {/* 3 Metric Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 pb-2 border-y border-zinc-200/60 sm:border-none">
              {/* Metric 1 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/Global Presence-icon 2.svg"
                    alt="Countries Global Presence"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#081022] leading-none">
                    50+
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#5B6776] font-medium mt-1 leading-tight">
                    Countries Global<br />Presence
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/Worker-icon 2 (1).svg"
                    alt="Dedicated Professionals"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-[#081022] leading-none">
                    150+
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#5B6776] font-medium mt-1 leading-tight">
                    Dedicated<br />Professionals
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src="/Reliable 1.svg"
                    alt="OEM / Private Label Solutions"
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black italic text-[#081022] leading-tight">
                    OEM/Private Label
                  </div>
                  <div className="text-[11px] sm:text-xs text-[#5B6776] font-medium mt-1 leading-tight">
                    Flexible Solutions
                  </div>
                </div>
              </div>
            </div>

            {/* Wide Orange Pill CTA Button */}
            <div className="pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center flex-wrap px-6 sm:px-8 py-3.5 rounded-full bg-[#F6851F] hover:bg-[#E07312] text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 text-center"
              >
                <span>Request Your Product</span>
                <span className="mx-2 sm:mx-3 text-white/60">|</span>
                <span>OEM / Private Label</span>
                <span className="mx-2 sm:mx-3 text-white/60">|</span>
                <span>Global Distribution</span>
              </Link>
            </div>
          </div>

          {/* Right Column: World Map & Instruments Visual */}
          <div className="lg:col-span-6 xl:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[660px]">
              <Image
                src="/image 353.svg"
                alt="Global Reach Long-term Partnerships"
                width={660}
                height={400}
                unoptimized
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
