'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getStoredProjectDev } from '@/src/lib/dataStore'
import { ProjectDevelopmentSection as ProjectDevType } from '@/src/types'

export default function ProjectDevelopmentSection() {
  const [data, setData] = useState<ProjectDevType>(getStoredProjectDev())

  const reloadData = () => {
    setData(getStoredProjectDev())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100">
      <div className="max-w-[1380px] mx-auto space-y-12 sm:space-y-16">
        {/* ── Top 5-Feature Bar matching ss 2 ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-2 items-center border-b border-zinc-200/80 pb-10">
          {data.features.map((item, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center text-center px-3 ${
                idx > 0 ? 'lg:border-l lg:border-zinc-200' : ''
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center mb-3">
                <Image
                  src={item.icon}
                  alt={item.title.replace('\n', ' ')}
                  width={44}
                  height={44}
                  unoptimized
                  className="object-contain"
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#081022] leading-tight whitespace-pre-line">
                {item.title}
              </h4>
            </div>
          ))}
        </div>

        {/* ── Main 3-Column Split matching ss 2 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Text Content */}
          <div className="lg:col-span-5 space-y-5">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
              {data.eyebrow || 'EXPLORE PRODUCTS'}
            </span>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-[#081022] tracking-tight leading-tight">
              {data.title_main || 'New Products'}{' '}
              <span className="text-[#F6851F] block">
                {data.title_highlight || 'Project Development'}
              </span>
            </h3>

            {/* Paragraphs */}
            <div className="space-y-3 pt-1">
              {data.paragraphs.map((p, i) => (
                <p key={i} className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Learn More Button */}
            <div className="pt-2">
              <Link
                href={data.button_link || '/production'}
                className="inline-flex items-center px-7 py-3 bg-[#081022] hover:bg-[#0D3969] text-white text-xs font-bold rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                {data.button_text || 'Learn More'}
              </Link>
            </div>
          </div>

          {/* Center Column: Technical Blueprint Image */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-[420px] rounded-2xl overflow-hidden shadow-xl border border-zinc-200/90 bg-[#FAFAFC] group">
              <Image
                src={data.image_url || '/image 351 (1).svg'}
                alt="New Products Project Development"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column: 6-Step Process List matching ss 1 */}
          <div className="lg:col-span-3 space-y-5 pl-0 lg:pl-2">
            {data.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3.5 group">
                {/* Solid circular bullet matching ss 1 */}
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#D4D4D8] shrink-0 group-hover:bg-[#F6851F] transition-colors" />

                {/* Step Name */}
                <span className="text-xs sm:text-sm font-bold text-[#081022] leading-tight group-hover:text-[#F6851F] transition-colors">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
