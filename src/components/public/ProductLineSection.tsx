'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Shield } from 'lucide-react'
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
  const sanitizeImg = (url: string | undefined) => {
    if (!url || url.startsWith('blob:')) return '/images/catalogues/laryngoscope-cover.webp'
    return url.replace(/ /g, '%20')
  }

  const [imgSrc, setImgSrc] = useState(sanitizeImg(card.image))
  const [badgeSrc, setBadgeSrc] = useState(card.badgeIcon || '/laryngoscope-2.svg')
  const [badgeFailed, setBadgeFailed] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  useEffect(() => {
    setImgSrc(sanitizeImg(card.image))
    setBadgeSrc(card.badgeIcon || '/laryngoscope-2.svg')
    setBadgeFailed(false)
    setImgFailed(false)
  }, [card.image, card.badgeIcon])

  const stickyTop = 84 + index * 10
  const isLast = index === total - 1
  const marginBottom = isLast ? '0' : '48vh'
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
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0A0E17] border border-white/15 shadow-[0_-12px_45px_rgba(0,0,0,0.2),0_25px_60px_rgba(0,0,0,0.3)] flex flex-col justify-between group cursor-pointer block transition-all duration-300 hover:border-orange-500/40"
        style={{
          minHeight: 'clamp(400px, 52vh, 560px)',
        }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0A0E17]">
          {!imgFailed && (
            <Image
              src={imgSrc}
              alt={card.title}
              fill
              unoptimized
              priority={index === 0}
              onError={() => {
                if (imgSrc !== '/images/catalogues/laryngoscope-cover.webp') {
                  setImgSrc('/images/catalogues/laryngoscope-cover.webp')
                } else {
                  setImgFailed(true)
                }
              }}
              className="object-cover object-right sm:object-center group-hover:scale-105 transition-transform duration-700"
            />
          )}
          {/* Refined gradient: darkens left side for text readability while keeping the surgical instrument crisp and bright */}
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
            {badgeFailed ? (
              <Shield
                className={`w-6 h-6 ${isWhiteBadge ? 'text-[#F6851F]' : 'text-white'}`}
              />
            ) : (
              <Image
                src={badgeSrc}
                alt="Badge Icon"
                width={28}
                height={28}
                unoptimized
                onError={() => setBadgeFailed(true)}
                className={`object-contain ${isWhiteBadge ? '' : 'brightness-0 invert'}`}
              />
            )}
          </div>

          {/* Right Index Pill */}
          <span className="px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-black/50 backdrop-blur-md border border-white/20 tracking-wider shadow">
            {card.indexLabel}
          </span>
        </div>

        {/* Middle Spacer */}
        <div className="h-12 sm:h-20" />

        {/* Bottom Content Area */}
        <div className="relative z-10 p-6 sm:p-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-10">
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
}

export default function ProductLineSection() {
  const [data, setData] = useState<ProductLineShowcase>(getStoredProductLine())
  const [cards, setCards] = useState<PortfolioShowcaseCard[]>(getStoredProductLineCards())

  const reloadData = () => {
    setData(getStoredProductLine())

    // Direct synchronization with Section 1 (Airway) categories if defined
    const cats = (getStoredCategories() || []).filter(
      (c) => Boolean(c) && (c.section === 'airway' || !c.section || c.section === 'section_1') && c.is_published !== false
    )
    if (cats.length > 0) {
      const mapped: PortfolioShowcaseCard[] = cats.map((cat, idx) => {
        const catName = cat?.name || 'Airway Product'
        return {
          id: `card-${cat?.id || idx}`,
          tag: catName.toLowerCase().includes('single')
            ? 'Sterile Disposable Solutions'
            : 'Reusable Airway Management',
          title: catName,
          subtitle: cat?.description || '',
          image:
            cat?.card_image && !cat.card_image.startsWith('blob:')
              ? cat.card_image
              : cat?.image_url && !cat.image_url.startsWith('blob:')
              ? cat.image_url
              : '/images/catalogues/laryngoscope-cover.webp',
          badgeIcon: '/laryngoscope-2.svg',
          badgeBg: catName.toLowerCase().includes('single') ? 'bg-[#F6851F]' : 'bg-white/95',
          buttonText: `Explore ${catName.replace(' Laryngoscopes', '')} Line`,
          buttonLink: `/products?category=${cat?.slug || ''}`,
          indexLabel: `0${idx + 1} / 0${cats.length}`,
          sort_order: cat?.sort_order || idx + 1,
          is_active: true,
        }
      })
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
