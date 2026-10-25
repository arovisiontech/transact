'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ComplianceAndBlogsSection() {
  return (
    <section className="bg-white border-b border-zinc-100 overflow-hidden">
      {/* ======================================================== */}
      {/* PART 1: COMPLIANCE & QUALITY FULL-WIDTH BANNER (ss 2)    */}
      {/* ======================================================== */}
      <div className="w-full bg-[#F6851F] relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[420px] lg:min-h-[480px]">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-7 py-12 lg:py-16 pr-0 lg:pr-8 z-10 space-y-6">
              <div>
                <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.06] mb-5">
                  Compliance &<br />
                  Quality
                </h2>
                <p className="text-white text-xs sm:text-sm leading-relaxed max-w-xl">
                  Transact International Is Committed To Meeting Internationally Recognized Medical Device Regulations And Quality Management Standards. Our Laryngoscopes And Airway Management Instruments Are Carefully Manufactured, Inspected, And Validated To Deliver Consistent Quality, Reliable Performance, And Compliance With The Regulatory Requirements Of The USA, European Union, United Kingdom, And Global Healthcare Markets.
                </p>
              </div>

              {/* 4 White Regulatory Certifications using exact assets */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-10">
                {/* 1. ISO 13485 : 2016 -> image 232.svg */}
                <div className="relative h-12 sm:h-14 w-28 sm:w-36 flex-shrink-0">
                  <Image
                    src="/image 232.svg"
                    alt="ISO 13485 : 2016 Certification"
                    fill
                    unoptimized
                    className="object-contain object-left"
                  />
                </div>

                {/* 2. CE Certification -> image 234.svg */}
                <div className="relative h-10 sm:h-12 w-14 sm:w-20 flex-shrink-0">
                  <Image
                    src="/image 234.svg"
                    alt="CE Mark Certification"
                    fill
                    unoptimized
                    className="object-contain object-left"
                  />
                </div>

                {/* 3. FDA Registered -> image 235.svg */}
                <div className="relative h-8 sm:h-10 w-20 sm:w-28 flex-shrink-0">
                  <Image
                    src="/image 235.svg"
                    alt="FDA Registered Medical Device"
                    fill
                    unoptimized
                    className="object-contain object-left"
                  />
                </div>

                {/* 4. EU-MDR Compliant -> image 236 (1).png */}
                <div className="relative h-8 sm:h-10 w-24 sm:w-32 flex-shrink-0">
                  <Image
                    src="/image 236 (1).png"
                    alt="EU-MDR European Medical Device Regulation"
                    fill
                    unoptimized
                    className="object-contain object-left brightness-0 invert"
                  />
                </div>
              </div>
            </div>

            {/* Right Doctor Visual Column matching ss 2 */}
            <div className="lg:col-span-5 xl:col-span-5 relative h-full min-h-[360px] lg:min-h-[480px] flex items-end justify-end overflow-hidden">
              <div
                className="relative w-full h-full min-h-[380px] lg:min-h-[480px] flex items-end justify-end"
                style={{
                  maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 100%)',
                  WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 100%)',
                }}
              >
                <Image
                  src="/medical-professional-in-lab-coat-holding-a-diagnos-2026-07-24-22-17-32-utc 1.svg"
                  alt="Medical Professional Diagnostic Quality"
                  fill
                  unoptimized
                  priority
                  className="object-cover object-right-bottom mix-blend-luminosity"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* PART 2: INSIGHTS FROM OUR LATEST BLOGS                   */}
      {/* ======================================================== */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-14 sm:py-20 space-y-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#5B6776] block">
              INSIGHTS FROM OUR
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#081022] tracking-tight mt-1">
              Latest Blogs
            </h2>
            <div className="w-10 h-0.5 bg-[#F6851F] mt-2" />
          </div>

          <p className="text-xs sm:text-sm text-[#5B6776] max-w-md leading-relaxed sm:text-right">
            Stay Updated With The Latest Trends, Innovations, And Expert Insights In The Manufacturing And Industrial Sectors.
          </p>
        </div>

        {/* 2-Card Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Card 1: Manufacturing & Quality */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
            {/* Blog Top Image */}
            <div className="relative w-full aspect-[841/279] overflow-hidden bg-zinc-100">
              <Image
                src="/Rectangle 847.svg"
                alt="Manufacturing & Quality Technology"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Card Footer Details */}
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4 bg-white flex-1">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#F6851F]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
                    MANUFACTURING & QUALITY
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#081022] group-hover:text-[#F6851F] transition-colors line-clamp-1 mt-0.5">
                    The Technology Behind High-Performance Instruments
                  </h3>
                </div>
              </div>

              <Link
                href="/blogs"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F6851F] text-white flex items-center justify-center group-hover:bg-[#E07312] transition-colors shadow-sm flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Card 2: Medical Innovation */}
          <div className="rounded-2xl border border-zinc-200/80 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
            {/* Blog Top Image */}
            <div className="relative w-full aspect-[841/279] overflow-hidden bg-zinc-100">
              <Image
                src="/Rectangle 847.svg"
                alt="Medical Innovation Airway Management"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Card Footer Details */}
            <div className="p-5 sm:p-6 flex items-center justify-between gap-4 bg-white flex-1">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-[#F6851F]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#718096] uppercase tracking-wider block">
                    MEDICAL INNOVATION
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-[#081022] group-hover:text-[#F6851F] transition-colors line-clamp-1 mt-0.5">
                    The Technology Behind High-Performance Diagnostics
                  </h3>
                </div>
              </div>

              <Link
                href="/blogs"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F6851F] text-white flex items-center justify-center group-hover:bg-[#E07312] transition-colors shadow-sm flex-shrink-0"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
