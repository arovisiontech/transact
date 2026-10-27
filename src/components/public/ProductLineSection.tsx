'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getStoredProductLine } from '@/src/lib/dataStore'
import { ProductLineShowcase } from '@/src/types'

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

export default function ProductLineSection() {
  const [data, setData] = useState<ProductLineShowcase>(getStoredProductLine())

  const reloadData = () => {
    setData(getStoredProductLine())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  // 4 Smooth Stacking Cards matching Micromar reference & user screenshots
  const cards: ProductCardItem[] = [
    {
      id: 'laryngoscopes-main',
      tag: data.tag || 'Reusable & Disposable Airway Management',
      title: data.item_title || 'Laryngoscopes',
      subtitle:
        data.item_subtitle ||
        'Prioritising Ergonomic Design Enhancing Lives. German stainless steel blades and handles engineered for safe, controlled intubation.',
      image: data.image_url || '/Rectangle 819 (1).svg',
      badgeIcon: '/laryngoscope 2.svg',
      badgeBg: 'bg-white/95',
      buttonText: data.button_text || 'Meet The Laryngoscopes Line',
      buttonLink: data.button_link || '/products?category=laryngoscopes',
      indexLabel: '01 / 04',
    },
    {
      id: 'diagnostic-sets',
      tag: 'Fiber-Optic & High-Resolution Optics',
      title: 'Diagnostic & Otoscopy Sets',
      subtitle:
        'Advanced LED & Xenon illumination with scratch-resistant optical lenses delivering pristine clinical visualization for ENT examinations.',
      image: '/image 351 (1).svg',
      badgeIcon: '/Diagnostics 2.svg',
      badgeBg: 'bg-[#F6851F]',
      buttonText: 'Explore Diagnostics Line',
      buttonLink: '/products?category=diagnostics',
      indexLabel: '02 / 04',
    },
    {
      id: 'pocket-otoscope',
      tag: 'Pocket Diagnostic Airway Systems',
      title: 'Pocket Otoscopes',
      subtitle:
        'High-intensity fiber-optic illumination with precision multi-magnification lenses engineered for rapid, accurate clinical examinations.',
      image: '/Rectangle 839.svg',
      badgeIcon: '/Diagnostics 2.svg',
      badgeBg: 'bg-[#F6851F]',
      buttonText: 'Explore Otoscopy Systems',
      buttonLink: '/products?category=diagnostics',
      indexLabel: '03 / 04',
    },
    {
      id: 'surgical-instruments',
      tag: 'Hospital-Grade German Stainless Steel AISI 420 / 440',
      title: 'Surgical & Airway Solutions',
      subtitle:
        'Micro-tolerance drop-forged instruments with cryogenic heat treatment, individual serialization, and global regulatory certification.',
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
      id="product-line-section"
      className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100 transition-colors"
    >
      <div className="max-w-[1340px] mx-auto space-y-12 sm:space-y-16">
        {/* ── Section Header matching ss 1 ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#F6851F] text-xs font-bold uppercase tracking-wider">
            <span>Portfolio Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
            {data.title || 'Our Complete Product Line'}
          </h2>

          <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed whitespace-pre-line max-w-xl mx-auto">
            {data.subtitle ||
              'Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management.\nImages Are For Illustrative Purposes Only.'}
          </p>
        </div>

        {/* ── Stacking Cards Container (Micromar Reference: smooth sticky stacking cards) ── */}
        <div className="relative pb-24">
          {cards.map((card, index) => {
            // Sticky top offset
            const stickyTop = 84 + index * 10
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
                  className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F5F4] border border-zinc-200/90 shadow-[0_-12px_45px_rgba(0,0,0,0.12),0_25px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between group"
                  style={{
                    minHeight: 'clamp(440px, 62vh, 640px)',
                  }}
                >
                  {/* Background Image */}
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
                        alt="Badge Icon"
                        width={28}
                        height={28}
                        unoptimized
                        className={`object-contain ${isWhiteBadge ? '' : 'brightness-0 invert'}`}
                      />
                    </div>

                    {/* Right Index Pill */}
                    <span className="px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-black/45 backdrop-blur-md border border-white/20 tracking-wider shadow">
                      {card.indexLabel}
                    </span>
                  </div>

                  {/* Middle Spacer to allow large card visuals */}
                  <div className="h-32 sm:h-48 md:h-56" />

                  {/* Bottom Content Area */}
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
