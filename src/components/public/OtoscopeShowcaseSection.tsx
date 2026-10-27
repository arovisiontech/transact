'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface ProductCardItem {
  id: string
  tag: string
  title: string
  subtitle: string
  image: string
  badgeIcon: string
  badgeBg: string
  buttonText: string
  buttonLink: string
  indexLabel: string
}

export default function OtoscopeShowcaseSection() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'diagnostics' | 'laryngoscopes' | 'surgical'>('all')

  // 4 Stacking Cards matching Micromar reference & user screenshots
  const cards: ProductCardItem[] = [
    {
      id: 'otoscope',
      tag: 'Pocket Diagnostic',
      title: 'Otoscope',
      subtitle:
        'Prioritising Ergonomic Design Enhancing Lives. Advanced fiber-optic illumination with scratch-resistant lenses delivering pristine clinical visualization for ear and canal inspection.',
      image: '/Rectangle 839.svg',
      badgeIcon: '/Diagnostics 2.svg',
      badgeBg: 'bg-[#F6851F]',
      buttonText: 'Meet The Otoscope Line',
      buttonLink: '/products?category=diagnostics',
      indexLabel: '01 / 04',
    },
    {
      id: 'laryngoscope',
      tag: 'Reusable & Disposable Airway Systems',
      title: 'Laryngoscopes',
      subtitle:
        'Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management. Precision German stainless steel blades with integrated fiber-optics and ergonomic knurled handles.',
      image: '/Rectangle 819 (1).svg',
      badgeIcon: '/laryngoscope 2.svg',
      badgeBg: 'bg-white/95',
      buttonText: 'Meet The Laryngoscopes Line',
      buttonLink: '/products?category=laryngoscopes',
      indexLabel: '02 / 04',
    },
    {
      id: 'ophthalmoscope',
      tag: 'Clinical Diagnostic Arrays',
      title: 'Ophthalmoscopes & ENT Sets',
      subtitle:
        'Coaxial optical alignment providing shadow-free fundoscopy, high-definition retinal examination, and multi-aperture lens selection for comprehensive patient evaluation.',
      image: '/image 351 (1).svg',
      badgeIcon: '/Diagnostics 2.svg',
      badgeBg: 'bg-[#F6851F]',
      buttonText: 'Explore Diagnostic Sets',
      buttonLink: '/products?category=diagnostics',
      indexLabel: '03 / 04',
    },
    {
      id: 'surgical-solutions',
      tag: 'Hospital-Grade German Stainless Steel AISI 420 / 440',
      title: 'Surgical & Airway Solutions',
      subtitle:
        'Drop-forged surgical instruments with cryogenic hardening, micrometer tolerance, and certified biocompatibility engineered for operating room suites worldwide.',
      image: '/image 352.svg',
      badgeIcon: '/laryngoscope 2.svg',
      badgeBg: 'bg-white/95',
      buttonText: 'Discover Full Catalogues',
      buttonLink: '/catalogues',
      indexLabel: '04 / 04',
    },
  ]

  return (
    <section
      id="complete-product-line-showcase"
      className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100 transition-colors"
    >
      <div className="max-w-[1380px] mx-auto space-y-10 sm:space-y-12">
        {/* ── Section Header with Dual Accent Line (matching ss 1) ── */}
        <div className="text-center space-y-3">
          {/* Dual Navy/Orange accent bar */}
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="w-9 h-1 bg-[#081022] rounded-full" />
            <span className="w-9 h-1 bg-[#F6851F] rounded-full" />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#081022] tracking-tight">
            Our Complete Product Line
          </h2>

          <p className="text-xs sm:text-sm text-[#5B6776] max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            Advanced Diagnostics Designed For Safe, Reliable, And Controlled Airway Management.
            {'\n'}Images Are For Illustrative Purposes Only.
          </p>
        </div>

        {/* ── Filter / Navigation Strip matching ss 1 ── */}
        <div className="flex items-center justify-start pb-2">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081022] text-white text-xs sm:text-sm font-semibold hover:bg-[#1a233a] transition-all shadow-sm group"
          >
            <span>All Projects</span>
            <svg
              className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform"
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

        {/* ── Stacking Cards Container (Micromar Reference: buttery smooth scroll with distinct track per card) ── */}
        <div className="relative pb-24">
          {cards.map((card, index) => {
            // Sticky top offset so cards nest cleanly like an album deck
            const stickyTop = 84 + index * 10
            // Generous scroll margin so each card has its own peaceful travel distance
            const isLast = index === cards.length - 1
            const marginBottom = isLast ? '0' : '50vh'

            const isWhiteBadge = card.badgeBg.includes('white')

            return (
              <div
                key={card.id}
                className="sticky w-full transition-all duration-300"
                style={{
                  top: `${stickyTop}px`,
                  zIndex: index + 10,
                  marginBottom: marginBottom,
                }}
              >
                {/* ── Visual Card Surface ── */}
                <div
                  className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#8E9094] border border-zinc-200/90 shadow-[0_-12px_45px_rgba(0,0,0,0.12),0_25px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between group"
                  style={{
                    minHeight: 'clamp(440px, 62vh, 640px)',
                  }}
                >
                  {/* Background Instrument Visual */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                    />
                    {/* Dark gradient for text readability and cinematic depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 pointer-events-none" />
                  </div>

                  {/* Top Bar: Left circular badge + Right index pill */}
                  <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between">
                    {/* Left Circular Icon Badge */}
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg p-2.5 transition-transform group-hover:scale-105 ${
                        isWhiteBadge
                          ? 'bg-white/95 backdrop-blur-md border border-zinc-200/60'
                          : 'bg-[#F6851F] shadow-orange-500/30'
                      }`}
                    >
                      <Image
                        src={card.badgeIcon}
                        alt="Icon Badge"
                        width={28}
                        height={28}
                        unoptimized
                        className={`object-contain ${isWhiteBadge ? '' : 'brightness-0 invert'}`}
                      />
                    </div>

                    {/* Right Index / Indicator Pill */}
                    <span className="px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-black/45 backdrop-blur-md border border-white/20 tracking-wider shadow">
                      {card.indexLabel}
                    </span>
                  </div>

                  {/* Middle Spacer to allow large card visuals */}
                  <div className="h-32 sm:h-48 md:h-56" />

                  {/* Bottom Content Area: Details + Action Button (matching ss 1 & ss 2) */}
                  <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12">
                    {/* Left Info Column */}
                    <div className="space-y-3 max-w-2xl">
                      {/* Pill Tag */}
                      <div>
                        <span className="inline-block px-4 sm:px-5 py-1.5 rounded-full border border-white/40 bg-white/15 backdrop-blur-md text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm">
                          {card.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none drop-shadow-sm font-sans">
                        {card.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wide max-w-xl leading-relaxed">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Right Action Button */}
                    <div className="shrink-0 pt-2 sm:pt-0">
                      <Link
                        href={card.buttonLink}
                        className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs sm:text-sm font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group/btn"
                      >
                        <span>{card.buttonText}</span>
                        <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center group-hover/btn:translate-x-1 transition-transform">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
