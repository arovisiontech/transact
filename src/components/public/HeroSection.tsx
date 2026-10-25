'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, X } from 'lucide-react'
import { getStoredHeroSlides } from '@/src/lib/dataStore'
import { HeroSlideItem } from '@/src/types'

interface HeroSectionProps {
  onOpenSearch?: () => void
  onOpenQuote?: () => void
}

export default function HeroSection({ onOpenSearch, onOpenQuote }: HeroSectionProps) {
  const [slides, setSlides] = useState<HeroSlideItem[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [activeVideoUrl, setActiveVideoUrl] = useState<string>('')
  const [isPaused, setIsPaused] = useState(false)

  const loadData = () => {
    const list = getStoredHeroSlides().filter((s) => s.is_active)
    if (list.length > 0) {
      setSlides(list.sort((a, b) => a.sort_order - b.sort_order))
    }
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  // Auto-cycle every 7s if multiple slides
  useEffect(() => {
    if (slides.length <= 1 || isPaused || isVideoModalOpen) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [slides.length, isPaused, isVideoModalOpen])

  const active = slides[currentSlide] || slides[0] || {
    id: 'default',
    title: 'Precision For Life',
    subtitle:
      'For Over 35+ Years, We Have Been Developing High-Performance Laryngoscopy Solutions Designed To Support ENT Professionals With Precision, Control And Reliability —',
    image: '/image 333.svg',
    video_url:
      'https://hhcehcdthzdssbperccd.supabase.co/storage/v1/object/public/hero-slides/hero-videos/1790866403370-web.mp4',
    is_active: true,
    sort_order: 1,
  }

  const defaultVideo =
    'https://hhcehcdthzdssbperccd.supabase.co/storage/v1/object/public/hero-slides/hero-videos/1790866403370-web.mp4'
  const currentVideo = active.video_url || defaultVideo

  const handleOpenVideo = (url?: string) => {
    setActiveVideoUrl(url || currentVideo)
    setIsVideoModalOpen(true)
  }

  return (
    <>
      <section
        aria-label="Transact Hero Banner"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        className="relative w-full overflow-hidden bg-[#050811] flex items-center justify-center"
        style={{ minHeight: 'clamp(520px, 75vh, 840px)' }}
      >
        {/* ── Background Image with Smooth Transitions ── */}
        <div className="absolute inset-0 z-0">
          <Image
            key={active.id}
            src={active.image || '/image 333.svg'}
            alt={active.title || 'Precision For Life'}
            fill
            priority
            unoptimized
            className="object-cover object-center transition-opacity duration-1000"
          />
          {/* Subtle dark gradient overlay to guarantee text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 z-10" />
        </div>

        {/* ── Center Content Area Matching ss 1 & ss 2 ── */}
        <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center flex flex-col items-center justify-center">
          {/* Play Video Button at top */}
          <button
            type="button"
            onClick={() => handleOpenVideo(active.video_url)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/10 hover:bg-[#F6851F]/90 border border-white/30 hover:border-[#F6851F] backdrop-blur-md flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 shadow-2xl cursor-pointer group mb-6"
            title="Play Facility & Production Tour"
            aria-label="Play Facility Tour Video"
          >
            <Play className="w-6 h-6 sm:w-7 sm:h-7 fill-white translate-x-0.5 group-hover:scale-105 transition-transform" />
          </button>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            {active.title || 'Precision For Life'}
          </h1>

          {/* Subheading */}
          <p className="mt-4 mb-8 text-xs sm:text-sm md:text-base text-zinc-300 font-normal max-w-2xl leading-relaxed drop-shadow-sm">
            {active.subtitle ||
              'For Over 35+ Years, We Have Been Developing High-Performance Laryngoscopy Solutions Designed To Support ENT Professionals With Precision, Control And Reliability —'}
          </p>

          {/* Two Pills: Laryngoscope & Diagnostics */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5">
            <Link
              href="/products?category=laryngoscopes"
              className="flex items-center gap-3 bg-[#0A1428]/95 hover:bg-[#0E1E3D] border border-white/20 hover:border-[#F6851F] pl-1.5 pr-5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xl group cursor-pointer"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F6851F] flex items-center justify-center shrink-0 p-1.5 group-hover:scale-105 transition-transform">
                <Image
                  src="/laryngoscope 2.svg"
                  alt="Laryngoscope Icon"
                  width={18}
                  height={18}
                  unoptimized
                  className="object-contain brightness-0 invert"
                />
              </span>
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                Laryngoscope
              </span>
            </Link>

            <Link
              href="/products?category=diagnostics"
              className="flex items-center gap-3 bg-[#0A1428]/95 hover:bg-[#0E1E3D] border border-white/20 hover:border-[#F6851F] pl-1.5 pr-5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-xl group cursor-pointer"
            >
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F6851F] flex items-center justify-center shrink-0 p-1.5 group-hover:scale-105 transition-transform">
                <Image
                  src="/Diagnostics 2.svg"
                  alt="Diagnostics Icon"
                  width={18}
                  height={18}
                  unoptimized
                  className="object-contain brightness-0 invert"
                />
              </span>
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide">
                Diagnostics
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Video Modal ── */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative bg-[#081022] border border-white/20 rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl p-4 sm:p-6 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-white">
              <h3 className="text-sm font-bold">Transact International · Facility &amp; Production Tour</h3>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <video
                src={activeVideoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              >
                Your browser does not support HTML5 video.
              </video>
            </div>
            <div className="flex justify-end text-xs text-zinc-400">
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-white hover:text-[#F6851F] font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
