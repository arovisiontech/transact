'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function ComplianceAndBlogsSection() {
  return (
    <section className="bg-white border-b border-zinc-100 overflow-hidden">
      {/* ======================================================== */}
      {/* INSIGHTS FROM OUR LATEST BLOGS                           */}
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
