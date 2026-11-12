'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getStoredOtoscopeCards, getStoredCategories, syncServerData } from '@/src/lib/dataStore'
import { PortfolioShowcaseCard } from '@/src/types'

export default function OtoscopeShowcaseSection() {
  const [cards, setCards] = useState<PortfolioShowcaseCard[]>(getStoredOtoscopeCards())

  const reloadData = () => {
    // Direct synchronization with Section 2 (Diagnostics) categories if defined
    const cats = (getStoredCategories() || []).filter(
      (c) => Boolean(c) && (c.section === 'diagnostics' || c.section === 'section_2') && c.is_published !== false
    )
    if (cats.length > 0) {
      const mapped: PortfolioShowcaseCard[] = cats.map((cat, idx) => {
        const catName = cat?.name || 'Diagnostic Instrument'
        return {
          id: `card-${cat?.id || idx}`,
          tag: catName.toLowerCase().includes('pocket')
            ? 'Pocket Diagnostic Airway Systems'
            : 'Fiber-Optic & High-Resolution Optics',
          title: catName,
          subtitle: cat?.description || '',
          image: cat?.card_image || cat?.image_url || '/image 351 (1).svg',
          badgeIcon: '/Diagnostics 2.svg',
          badgeBg: 'bg-[#F6851F]',
          buttonText: `Explore ${catName.replace(' Sets', '')} Line`,
          buttonLink: `/products?category=${cat?.slug || ''}`,
          indexLabel: `0${idx + 1} / 0${cats.length}`,
          sort_order: cat?.sort_order || idx + 1,
          is_active: true,
        }
      })
      setCards(mapped)
    } else {
      setCards(getStoredOtoscopeCards().filter((c) => c.is_active !== false))
    }
  }

  useEffect(() => {
    reloadData()
    syncServerData().then(reloadData)
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  return (
    <section
      id="complete-product-line-showcase"
      className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100 transition-colors"
    >
      <div className="max-w-[1380px] mx-auto space-y-10 sm:space-y-12">
        {/* ── Section Header with Dual Accent Line ── */}
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

        {/* ── Filter / Navigation Strip ── */}
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h7" />
            </svg>
          </Link>
        </div>

        {/* ── Stacking Cards Container (Clickable Anywhere) ── */}
        <div className="relative pb-24">
          {cards.map((card, index) => {
            const stickyTop = 84 + index * 10
            const isLast = index === cards.length - 1
            const marginBottom = isLast ? '0' : '55vh'
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
                {/* ── Visual Card Surface Wrapped in Link (Clickable Anywhere) ── */}
                <Link
                  href={card.buttonLink}
                  title={`Open ${card.title}`}
                  className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0E17] border border-white/15 shadow-[0_-12px_45px_rgba(0,0,0,0.2),0_25px_60px_rgba(0,0,0,0.3)] flex flex-col justify-between group cursor-pointer block transition-all duration-300 hover:border-orange-500/40"
                  style={{
                    minHeight: 'clamp(540px, 72vh, 760px)',
                  }}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0E17]">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      unoptimized
                      priority={index === 0}
                      className="object-cover object-right group-hover:scale-105 transition-transform duration-700"
                    />
                    {/* Balanced gradient: darkens left side for text while leaving diagnostic instrument bright */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none" />
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

                  {/* Middle Spacer */}
                  <div className="h-28 sm:h-44 md:h-56" />

                  {/* Bottom Content Area: Details + Action Button */}
                  <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10">
                    {/* Left Info Column */}
                    <div className="space-y-3 max-w-2xl">
                      {/* Pill Tag */}
                      <div>
                        <span className="inline-block px-4 sm:px-5 py-1.5 rounded-full border border-white/40 bg-white/15 backdrop-blur-md text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm">
                          {card.tag}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight leading-tight drop-shadow-sm font-sans group-hover:text-orange-100 transition-colors">
                        {card.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-white/85 text-xs sm:text-sm font-medium tracking-wide max-w-xl leading-relaxed">
                        {card.subtitle}
                      </p>
                    </div>

                    {/* Right Action Button (Visual inside Link) */}
                    <div className="shrink-0 pt-2 sm:pt-0">
                      <div className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 bg-[#F6851F] group-hover:bg-[#e07516] text-white text-xs sm:text-sm font-bold rounded-full transition-all duration-300 shadow-xl group-hover:shadow-2xl">
                        <span>{card.buttonText}</span>
                        <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="w-3 h-3 text-white" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
