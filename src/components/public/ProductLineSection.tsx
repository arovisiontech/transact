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

  // 3 Stacking Cards matching Micromar reference
  const productCards: ProductCardItem[] = [
    {
      id: 'card-1',
      tag: data.tag || 'Reusable & Disposable Airway Management',
      title: data.item_title || 'Laryngoscopes',
      subtitle:
        data.item_subtitle ||
        'Prioritising Ergonomic Design Enhancing Lives. German stainless steel blades and handles engineered for safe, controlled intubation.',
      image: data.image_url || '/Rectangle 819 (1).svg',
      badgeIcon: '/laryngoscope 2.svg',
      buttonText: data.button_text || 'Meet The Laryngoscopes Line',
      buttonLink: data.button_link || '/products?category=laryngoscopes',
      indexLabel: '01 / 03',
    },
    {
      id: 'card-2',
      tag: 'Fiber-Optic & High-Resolution Optics',
      title: 'Diagnostic & Otoscopy Sets',
      subtitle:
        'Advanced LED & Xenon illumination with scratch-resistant lenses delivering pristine clinical visualization for ENT examinations.',
      image: '/image 351 (1).svg',
      badgeIcon: '/Diagnostics 2.svg',
      buttonText: 'Explore Diagnostics Line',
      buttonLink: '/products?category=diagnostics',
      indexLabel: '02 / 03',
    },
    {
      id: 'card-3',
      tag: 'Hospital-Grade German Stainless Steel AISI 420 / 440',
      title: 'Surgical & Specialty Solutions',
      subtitle:
        'Micro-tolerance drop-forged instruments with cryogenic heat treatment, individual serialization, and global regulatory certification.',
      image: '/image 352.svg',
      badgeIcon: '/laryngoscope 2.svg',
      buttonText: 'Discover Full Catalogues',
      buttonLink: '/catalogues',
      indexLabel: '03 / 03',
    },
  ]

  return (
    <section
      id="product-line-section"
      className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100 transition-colors"
    >
      <div className="max-w-[1340px] mx-auto space-y-12 sm:space-y-16">
        {/* ── Section Header matching ss 2 & ss 3 ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Subtle Accent Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#F6851F] text-xs font-bold uppercase tracking-wider">
            <span>Portfolio Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
            {data.title || 'Our Complete Product Line'}
          </h2>

          <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed whitespace-pre-line max-w-xl mx-auto">
            {data.subtitle ||
              'Advanced Laryngoscopes & Medical Instruments Designed For Safe, Reliable, And Controlled Airway Management.\nImages Are For Illustrative Purposes Only.'}
          </p>
        </div>

        {/* ── Stacking Cards Container (Micromar Reference: sticky cards sliding over each other) ── */}
        <div className="relative space-y-16 sm:space-y-24 pb-16">
          {productCards.map((card, index) => {
            // Sticky top offset so cards nest cleanly like a deck of cards
            const stickyTop = 84 + index * 12

            return (
              <div
                key={card.id}
                className="sticky rounded-3xl overflow-hidden bg-[#F6F5F4] border border-zinc-200/90 shadow-[0_-8px_30px_rgba(0,0,0,0.08),0_24px_50px_rgba(0,0,0,0.14)] transition-all duration-300 group"
                style={{
                  top: `${stickyTop}px`,
                  zIndex: index + 10,
                  minHeight: '440px',
                }}
              >
                {/* ── Background Image with scale effect on hover ── */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  {/* Subtle Gradient to guarantee text contrast and legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10 pointer-events-none" />
                </div>

                {/* ── Top Bar: Left circular badge + Right index pill ── */}
                <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
                  {/* Left Instrument Badge */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-zinc-200/70 flex items-center justify-center p-3 transition-transform group-hover:scale-105">
                    <Image
                      src={card.badgeIcon}
                      alt="Badge Icon"
                      width={28}
                      height={28}
                      unoptimized
                      className="object-contain"
                    />
                  </div>

                  {/* Right Index / Count Pill */}
                  <span className="px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-black/40 backdrop-blur-md border border-white/20 tracking-wider">
                    {card.indexLabel}
                  </span>
                </div>

                {/* ── Spacer for Card Height ── */}
                <div className="h-32 sm:h-44 md:h-52" />

                {/* ── Bottom Content Area: Left details + Right CTA button ── */}
                <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-t from-black/85 via-black/50 to-transparent pt-12">
                  {/* Left Info */}
                  <div className="space-y-2.5 max-w-2xl">
                    {/* Pill Tag */}
                    <span className="inline-block px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 tracking-wide">
                      {card.tag}
                    </span>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                      {card.title}
                    </h3>

                    {/* Subtext */}
                    <p className="text-xs sm:text-sm text-zinc-200 font-normal leading-relaxed drop-shadow-sm max-w-xl">
                      {card.subtitle}
                    </p>
                  </div>

                  {/* Right CTA Button */}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}
