'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function OtoscopeShowcaseSection() {
  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden">
      <div className="max-w-[1380px] mx-auto space-y-8">
        {/* Header Block with Navy/Orange Accent Line */}
        <div className="text-center space-y-3">
          {/* Dual accent line */}
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="w-8 h-1 bg-[#081022] rounded-full" />
            <span className="w-8 h-1 bg-[#F6851F] rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#081022] tracking-tight">
            Our Complete Product Line
          </h2>

          <p className="text-xs sm:text-sm text-[#5B6776] max-w-2xl mx-auto leading-relaxed">
            Advanced Diagnostics Designed For Safe, Reliable, And Controlled Airway Management.
            <br className="hidden sm:inline" />
            Images Are For Illustrative Purposes Only.
          </p>
        </div>

        {/* Top-Left Category Selector Pill */}
        <div className="flex items-center justify-start">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081022] text-white text-xs sm:text-sm font-semibold hover:bg-[#1a233a] transition-colors shadow-sm"
          >
            <span>All Projects</span>
            <svg
              className="w-4 h-4 text-white/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Link>
        </div>

        {/* Main Product Card: Rectangle 839.svg */}
        <div className="relative w-full aspect-[1340/741] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-zinc-200/80 bg-[#8E9094] group">
          {/* Background Otoscope Visual */}
          <Image
            src="/Rectangle 839.svg"
            alt="Otoscope Diagnostics Complete Product Line"
            fill
            unoptimized
            priority
            className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
          />

          {/* Top Left Circular Icon Badge */}
          <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F6851F] flex items-center justify-center shadow-lg shadow-orange-500/30 p-2.5">
              <Image
                src="/Diagnostics 2.svg"
                alt="Otoscope Icon"
                width={30}
                height={30}
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>

          {/* Bottom Left Content Overlay */}
          <div className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 z-10 space-y-3 max-w-lg">
            {/* Pill Tag */}
            <div>
              <span className="inline-block px-5 py-1.5 rounded-full border border-white/50 bg-white/15 backdrop-blur-md text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm">
                Pocket
              </span>
            </div>

            {/* Title */}
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none drop-shadow-sm font-sans">
              Otoscope
            </h3>

            {/* Subtitle */}
            <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wide">
              Prioritising Ergonomic Design Enhancing Lives
            </p>
          </div>

          {/* Bottom Right CTA Button */}
          <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 z-10">
            <Link
              href="/products?category=otoscopes"
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-[#F6851F] hover:bg-[#E07312] text-white font-bold text-xs sm:text-sm tracking-wide shadow-lg shadow-orange-500/30 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Meet The Laryngoscope</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
