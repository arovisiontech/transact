'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { getStoredProductLine } from '@/src/lib/dataStore'
import { ProductLineShowcase } from '@/src/types'

export default function ProductLineSection() {
  const [data, setData] = useState<ProductLineShowcase>(getStoredProductLine())
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const reloadData = () => {
    setData(getStoredProductLine())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  const videoSrc = encodeURI(data.video_url || '/xC3Hykji4pvl53V3bFrZhUuFXfs (1).mp4')

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Browser autoplay policy handling
      })
    }
  }, [videoSrc])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    videoRef.current.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <section className="bg-white py-16 sm:py-24 px-4 sm:px-8 border-b border-zinc-100">
      <div className="max-w-[1340px] mx-auto space-y-10 sm:space-y-12">
        {/* ── Section Header matching ss 1 ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
            {data.title || 'Our Complete Product Line'}
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed whitespace-pre-line">
            {data.subtitle ||
              'Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management.\nImages Are For Illustrative Purposes Only.'}
          </p>
        </div>

        {/* ── Featured Banner Card matching ss 1 with Video ── */}
        <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-[#081022] aspect-[16/9] md:aspect-[21/10] min-h-[380px] sm:min-h-[460px] flex flex-col justify-between p-6 sm:p-10 border border-zinc-200/80 group">
          {/* Background Video & Fallback Poster */}
          <div className="absolute inset-0 z-0 bg-black">
            <video
              key={videoSrc}
              ref={videoRef}
              poster={data.image_url || '/Rectangle 819 (1).svg'}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={videoSrc} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>
            {/* Subtle Gradient to guarantee text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/30 pointer-events-none" />
          </div>

          {/* Top Row: Left Badge + Right Play/Audio Controls */}
          <div className="relative z-10 flex items-center justify-between">
            {/* Top-Left Logo / Badge */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-sm shadow-md border border-zinc-200/60 flex items-center justify-center p-2.5">
              <Image
                src="/laryngoscope 2.svg"
                alt="Badge Icon"
                width={26}
                height={26}
                unoptimized
                className="object-contain"
              />
            </div>

            {/* Video Controls (Play/Pause & Mute/Unmute) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlay}
                title={isPlaying ? 'Pause video' : 'Play video'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 text-white fill-white" />
                ) : (
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                title={isMuted ? 'Unmute video' : 'Mute video'}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg active:scale-95"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Content Area: Left details + Right CTA button */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            {/* Left Info */}
            <div className="space-y-2 max-w-xl">
              {/* Pill Tag */}
              <span className="inline-block px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold text-white bg-white/20 backdrop-blur-md border border-white/40 tracking-wide">
                {data.tag || 'Reusable'}
              </span>

              {/* Title */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {data.item_title || 'Laryngoscopes'}
              </h3>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-zinc-100 font-medium drop-shadow-sm">
                {data.item_subtitle || 'Prioritising Ergonomic Design Enhancing Lives'}
              </p>
            </div>

            {/* Right CTA Button */}
            <div className="shrink-0">
              <Link
                href={data.button_link || '/products?category=laryngoscopes'}
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs sm:text-sm font-bold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl cursor-pointer group/btn"
              >
                <span>{data.button_text || 'Meet The Laryngoscope'}</span>
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center group-hover/btn:translate-x-0.5 transition-transform">
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
