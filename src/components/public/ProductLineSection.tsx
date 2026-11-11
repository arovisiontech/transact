'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import {
  getStoredProductLine,
  getStoredProductLineCards,
  getStoredCategories,
  syncServerData,
} from '@/src/lib/dataStore'
import { ProductLineShowcase, PortfolioShowcaseCard } from '@/src/types'

function ShowcaseCardItem({
  card,
  index,
  total,
}: {
  card: PortfolioShowcaseCard
  index: number
  total: number
}) {
  const [imgSrc, setImgSrc] = useState(card.image || '/Rectangle-819-1.svg')
  const [badgeSrc, setBadgeSrc] = useState(card.badgeIcon || '/laryngoscope-2.svg')

  useEffect(() => {
    setImgSrc(card.image || '/Rectangle-819-1.svg')
    setBadgeSrc(card.badgeIcon || '/laryngoscope-2.svg')
  }, [card.image, card.badgeIcon])

  const stickyTop = 84 + index * 10
  const isLast = index === total - 1
  const marginBottom = isLast ? '0' : '50vh'
  const isWhiteBadge = card.badgeBg ? card.badgeBg.includes('white') : true

  return (
    <div
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
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F5F4] border border-zinc-200/90 shadow-[0_-12px_45px_rgba(0,0,0,0.12),0_25px_60px_rgba(0,0,0,0.18)] flex flex-col justify-between group cursor-pointer block"
        style={{
          minHeight: 'clamp(440px, 62vh, 640px)',
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={imgSrc}
            alt={card.title}
            fill
            unoptimized
            priority={index === 0}
            onError={() => setImgSrc('/Rectangle-819-1.svg')}
            className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-700"
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
              src={badgeSrc}
              alt="Badge Icon"
              width={28}
              height={28}
              unoptimized
              onError={() => setBadgeSrc('/laryngoscope-2.svg')}
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
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight leading-none drop-shadow-sm font-sans group-hover:text-orange-100 transition-colors">
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
}

export default function ProductLineSection() {
  const [data, setData] = useState<ProductLineShowcase>(getStoredProductLine())
  const [cards, setCards] = useState<PortfolioShowcaseCard[]>(getStoredProductLineCards())

  const reloadData = () => {
    setData(getStoredProductLine())

    // Direct synchronization with Section 1 (Airway) categories if defined
    const cats = getStoredCategories().filter(
      (c) => (c.section === 'airway' || !c.section || c.section === 'section_1') && c.is_published !== false
    )
    if (cats.length > 0) {
      const mapped: PortfolioShowcaseCard[] = cats.map((cat, idx) => ({
        id: `card-${cat.id}`,
        tag: cat.name.toLowerCase().includes('single')
          ? 'Sterile Disposable Solutions'
          : 'Reusable Airway Management',
        title: cat.name,
        subtitle: cat.description || '',
        image: cat.card_image || cat.image_url || '/Rectangle-819-1.svg',
        badgeIcon: '/laryngoscope-2.svg',
        badgeBg: cat.name.toLowerCase().includes('single') ? 'bg-[#F6851F]' : 'bg-white/95',
        buttonText: `Explore ${cat.name.replace(' Laryngoscopes', '')} Line`,
        buttonLink: `/products?category=${cat.slug}`,
        indexLabel: `0${idx + 1} / 0${cats.length}`,
        sort_order: cat.sort_order || idx + 1,
        is_active: true,
      }))
      setCards(mapped)
    } else {
      setCards(getStoredProductLineCards().filter((c) => c.is_active !== false))
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
      id="product-line-section"
      className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100 transition-colors"
    >
      <div className="max-w-[1340px] mx-auto space-y-12 sm:space-y-16">
        {/* ── Section Header ── */}
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

        {/* ── Stacking Cards Container (Clickable Anywhere) ── */}
        <div className="relative pb-24">
          {cards.map((card, index) => (
            <ShowcaseCardItem
              key={card.id}
              card={card}
              index={index}
              total={cards.length}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
