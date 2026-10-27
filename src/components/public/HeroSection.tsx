'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'
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

  // Autoplay video controls
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  const defaultVideo = '/xC3Hykji4pvl53V3bFrZhUuFXfs (1).mp4'

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
    video_url: defaultVideo,
    is_active: true,
    sort_order: 1,
  }

  const currentVideo = active.video_url || defaultVideo

  // Autoplay execution handling
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true
      videoRef.current.muted = isMuted
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.log('Video autoplay prevented or awaiting interaction:', err)
            setIsPlaying(false)
          })
      }
    }
  }, [isMuted])

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted
      videoRef.current.muted = nextMuted
      setIsMuted(nextMuted)
    }
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

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
        className="relative w-full overflow-hidden bg-[#050811] flex flex-col justify-end items-center min-h-[580px] sm:min-h-[640px] md:min-h-[720px] pb-10 sm:pb-14 pt-28"
        style={{ minHeight: 'clamp(560px, 80vh, 900px)' }}
      >
        {/* ── Background Video Playing Full Hero Section ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            poster={active.image || '/image 333.svg'}
            className="w-full h-full object-cover object-center scale-[1.01]"
          >
            <source src={encodeURI('/xC3Hykji4pvl53V3bFrZhUuFXfs (1).mp4')} type="video/mp4" />
            <source src="/xC3Hykji4pvl53V3bFrZhUuFXfs (1).mp4" type="video/mp4" />
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>

          {/* Fallback image if video cannot load */}
          <noscript>
            <Image
              src={active.image || '/image 333.svg'}
              alt={active.title || 'Precision For Life'}
              fill
              priority
              unoptimized
              className="object-cover object-center"
            />
          </noscript>

          {/* Cinematic gradient: clear in the middle, dark at bottom for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 pointer-events-none z-10" />
        </div>

        {/* ── Top-Right Floating Controls (Sound & Play/Pause) ── */}
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlayPause}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-[#F6851F] border border-white/20 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200 shadow-xl cursor-pointer"
            title={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
            aria-label={isPlaying ? 'Pause Background Video' : 'Play Background Video'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="px-3.5 h-10 sm:h-11 rounded-full bg-black/60 hover:bg-[#F6851F] border border-white/20 text-white backdrop-blur-md flex items-center gap-2 text-xs font-semibold transition-all duration-200 shadow-xl cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-zinc-300" />
                <span className="hidden sm:inline">Unmute</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Mute</span>
              </>
            )}
          </button>
        </div>

        {/* ── Bottom Content Area: moved from center to bottom so video is completely unobstructed ── */}
        <div className="relative z-20 max-w-3xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center justify-end w-full">
          {/* Heading - Refined, compact size aligned at bottom */}
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-snug drop-shadow-lg max-w-2xl">
            {active.title || 'Precision For Life'}
          </h1>

          {/* Subheading */}
          <p className="mt-2 mb-5 text-xs sm:text-[13px] md:text-sm text-zinc-300 font-normal max-w-lg leading-relaxed drop-shadow-md">
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
