'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import initialAboutData from '@/src/data/about.json'

export default function AboutPage() {
  const [data, setData] = useState(initialAboutData)
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0)

  useEffect(() => {
    // Fetch live about data from server API
    fetch('/api/about', { cache: 'no-store' })
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then((live) => {
        if (live && live.hero) {
          setData(live)
        }
      })
      .catch((e) => console.warn('About data load error:', e))
  }, [])

  const { hero, story, timeline, manufacturing, standards, productLine } = data

  return (
    <PublicShell>
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Matching SS 1 Reference)                */}
      {/* ======================================================== */}
      <section className="relative w-full bg-[#081022] text-white min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] 2xl:min-h-[620px] flex items-center overflow-hidden">
        {/* Background Operating Room Visual */}
        <div className="absolute inset-0 z-0">
          <Image
            src={hero.image_url || '/images/about/hero-operating-room.png'}
            alt="Transact Surgical Laryngoscope"
            fill
            priority
            unoptimized
            className="object-cover object-center"
          />
          {/* Subtle soft dark gradient on left for high-contrast crisp text matching SS 1 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent" />
        </div>

        {/* Content Container (optimized for mobile up to 64-inch 4K displays) */}
        <div className="relative z-10 max-w-[1440px] 2xl:max-w-[1680px] mx-auto px-6 sm:px-12 lg:px-16 2xl:px-20 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-3 sm:space-y-4">
            <p className="text-white/95 text-sm sm:text-base lg:text-lg font-medium tracking-wide">
              {hero.tagline || 'We Love Laryngoscope & Diagnostic'}
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold tracking-tight text-white leading-[1.12]">
              {hero.title_line1 || 'Since 1990'}
              <span className="block mt-1 sm:mt-2 text-white">
                {hero.title_line2 || 'Inspired By Life'}
              </span>
            </h1>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CHIEF ENGINEER & STORY (ss & svg section 2)           */}
      {/* ======================================================== */}
      <section className="bg-white py-14 sm:py-20 lg:py-28 px-4 sm:px-8 lg:px-12 border-b border-zinc-100">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-12">
          {/* Main Inspection Image: Rectangle 1098.svg */}
          <div className="relative w-full aspect-[1537/761] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 bg-zinc-900 group">
            <Image
              src={story.image_url || '/images/about/founder-cnc-engineer.png'}
              alt="Transact Master Cutler CNC Machining Inspection"
              fill
              unoptimized
              className="object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
          </div>

          {/* Two-Column Narrative matching Reference SVG */}
          <div className="space-y-6">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEFF9] text-[#081022] text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#F6851F]" />
              <span>{story.badge}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-2">
              {/* Left Column */}
              <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm lg:text-[15px] text-[#4A5568] leading-relaxed">
                <p>{story.left_p1}</p>
                <p>{story.left_p2}</p>
              </div>

              {/* Vertical Center Divider on Desktop */}
              <div className="hidden lg:block w-[1px] bg-zinc-200 self-stretch my-1" />

              {/* Right Column */}
              <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm lg:text-[15px] text-[#4A5568] leading-relaxed">
                <p>{story.right_p1}</p>
                <p>{story.right_p2}</p>

                {/* Mission & Craftsmanship Badges using image 422.png and image 425.png */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/60 border border-orange-100">
                    <div className="relative w-8 h-8 shrink-0">
                      <Image
                        src={story.mission_icon || '/image 422.png'}
                        alt="Mission Accuracy"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-[#081022]">Precision Accuracy</h5>
                      <p className="text-[10px] text-[#5B6776]">Laser Tolerance</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <div className="relative w-8 h-8 shrink-0">
                      <Image
                        src={story.engineering_icon || '/image 425.png'}
                        alt="Advanced Machining"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-[#081022]">CNC Engineering</h5>
                      <p className="text-[10px] text-[#5B6776]">5-Axis Robotic Spindles</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. TIMELINE: "Where It All Began" (Matching SS 1)        */}
      {/* ======================================================== */}
      <section className="bg-[#EFEEEC] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-8 sm:space-y-10">
          {/* Centered Top Statement matching SS 1 */}
          <div className="text-center max-w-4xl mx-auto px-4">
            <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-[#081022] leading-relaxed">
              {timeline.statement}
            </h3>
          </div>

          {/* Dark Timeline Card with image 421.svg background matching SS 1 */}
          <div className="relative max-w-5xl mx-auto rounded-[28px] sm:rounded-[34px] overflow-hidden shadow-2xl border border-zinc-800 bg-[#0A0E17]">
            {/* Background image 421.svg with dark overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/image 421.svg"
                alt="Transact Cleanroom Heritage"
                fill
                unoptimized
                className="object-cover object-center filter blur-[2px] opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
            </div>

            {/* Inner Content */}
            <div className="relative z-10 px-6 sm:px-12 py-10 sm:py-14 text-center">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-wide mb-8 sm:mb-12">
                {timeline.heading || 'Where It All Began'}
              </h2>

              {/* 2-Column Milestones side-by-side matching SS 1 */}
              {(() => {
                const milestones = timeline.milestones || []
                const m1 = milestones[activeTimelineIdx % milestones.length] || {}
                const m2 = milestones[(activeTimelineIdx + 1) % milestones.length] || {}

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 relative items-start">
                    {/* Horizontal connecting dashed line between badges on desktop */}
                    <div className="hidden md:block absolute bottom-[24px] left-[26%] right-[26%] border-t-2 border-dashed border-white/35 z-0" />

                    {/* Left Milestone (Active Primary) */}
                    <div className="relative z-10 space-y-2 max-w-sm mx-auto">
                      <span className="text-5xl sm:text-6xl font-black text-white font-sans tracking-tight block">
                        {m1.year}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                        {m1.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed min-h-[72px]">
                        {m1.description}
                      </p>
                      <div className="pt-4 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#F6851F] flex items-center justify-center shadow-lg shadow-orange-500/40 p-2.5">
                          <Image
                            src="/image 422.png"
                            alt="Accuracy Goal"
                            width={26}
                            height={26}
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Milestone (Secondary Preview) */}
                    <div className="relative z-10 space-y-2 max-w-sm mx-auto">
                      <span className="text-5xl sm:text-6xl font-black text-white/40 font-sans tracking-tight block">
                        {m2.year}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-white/50 tracking-tight">
                        {m2.title}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-zinc-400/60 leading-relaxed min-h-[72px]">
                        {m2.description}
                      </p>
                      <div className="pt-4 flex justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#F6851F] flex items-center justify-center shadow-lg shadow-orange-500/40 p-2.5">
                          <Image
                            src="/image 425.png"
                            alt="Engineering Gears"
                            width={26}
                            height={26}
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* 5 Bottom Dashes Pagination Indicator matching SS 1 */}
              <div className="flex items-center justify-center gap-2 pt-10">
                {(timeline.milestones || []).map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineIdx(idx)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeTimelineIdx === idx
                        ? 'w-8 bg-white'
                        : 'w-4 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Milestone ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. GLOBAL MANUFACTURING (Matching SS 3)                  */}
      {/* ======================================================== */}
      <section className="bg-white py-14 sm:py-20 lg:py-28 px-4 sm:px-8 border-b border-zinc-100 overflow-hidden relative">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto text-center space-y-6 sm:space-y-8 relative z-10">
          {/* Eyebrow Pill matching SS 3 */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFEFF9] text-[#081022] text-xs font-bold tracking-wide mx-auto border border-zinc-200/60 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#F6851F]" />
            <span>{manufacturing.badge || 'MANUFACTURING EXCELLENCE. DELIVERED WORLDWIDE.'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081022] tracking-tight">
            {manufacturing.title || 'GLOBAL MANUFACTURING'}
          </h2>

          <p className="text-xs sm:text-sm lg:text-base text-[#5B6776] max-w-3xl mx-auto leading-relaxed">
            {manufacturing.description}
          </p>

          {/* Dotted World Map centered with blank left/right space & concentric circular waves matching SS 3 */}
          <div className="relative w-full max-w-4xl mx-auto px-4 py-6 sm:py-10 flex items-center justify-center">
            {/* Concentric faint circular waves matching SS 3 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-[280px] h-[280px] rounded-full border border-zinc-300" />
              <div className="absolute w-[440px] h-[440px] rounded-full border border-zinc-200" />
              <div className="absolute w-[620px] h-[620px] rounded-full border border-zinc-200" />
              <div className="absolute w-[800px] h-[800px] rounded-full border border-zinc-100" />
            </div>

            <div className="relative w-full aspect-[1024/574] z-10">
              <Image
                src={manufacturing.map_image || '/image 424.svg'}
                alt="Transact Global Manufacturing & Supply Routes"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. COMMITMENT TO EXCELLENCE (Matching SS 4)              */}
      {/* ======================================================== */}
      <section className="bg-[#FAFAFC] py-14 sm:py-20 lg:py-24 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-10 sm:space-y-12">
          {/* Top Two-Column Row matching SS 4 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Header Narrative */}
            <div className="lg:col-span-6 space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#081022] tracking-tight leading-[1.14]">
                {standards.title_line1} <br />
                <span>{standards.title_line2}</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#5B6776] leading-relaxed max-w-lg">
                {standards.description}
              </p>
            </div>

            {/* Right Side Photo of Worker Packaging / Inspecting matching SS 4 */}
            <div className="lg:col-span-6 flex justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg aspect-[639/420] sm:aspect-[639/480] rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-zinc-900 group">
                <Image
                  src="/images/about/regulatory-worker-inspection.jpg"
                  alt="Transact Cleanroom Packaging Quality Control"
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* 5 Regulatory Cards sitting across horizontally matching SS 4 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-2">
            {/* 1. EU-MDR */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 flex items-center mb-3">
                  <span className="text-[#F6851F] font-black text-lg tracking-wider font-sans flex items-center gap-1">
                    EU-MDR
                    <svg className="w-4 h-4 text-[#F6851F]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#081022] mb-1.5">
                  EU-MDR
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Certification That Ensures Standardization Of Production Processes, With Strict Quality Control And Traceability At Each Stage.
                </p>
              </div>
            </div>

            {/* 2. GMP */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 flex items-center mb-3">
                  <div className="w-9 h-9 rounded-full border-2 border-[#F6851F] flex items-center justify-center text-[#F6851F] font-black text-[10px] tracking-tight">
                    GMP
                  </div>
                </div>
                <h4 className="text-sm font-black text-[#081022] mb-1.5">
                  GMP
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Certification That Ensures Standardization Of Production Processes, With Strict Quality Control And Traceability At Each Stage.
                </p>
              </div>
            </div>

            {/* 3. ISO */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 flex items-center mb-3">
                  <span className="text-[#F6851F] font-black text-2xl tracking-tighter font-sans">
                    ISO
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#081022] mb-1.5">
                  ISO
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Quality Management System Focused On Medical Devices, Ensuring Consistency In Development, Manufacturing, And Technical Control.
                </p>
              </div>
            </div>

            {/* 4. FDA */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 flex items-center mb-3">
                  <span className="text-[#F6851F] font-black text-2xl tracking-wider font-mono">
                    FDA
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#081022] mb-1.5">
                  FDA
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Certification That Ensures Standardization Of Production Processes, With Strict Quality Control And Traceability At Each Stage.
                </p>
              </div>
            </div>

            {/* 5. CE */}
            <div className="bg-white p-5 rounded-2xl border border-zinc-200/90 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="h-10 flex items-center mb-3">
                  <span className="text-[#F6851F] font-black text-2xl tracking-wider font-sans">
                    C E
                  </span>
                </div>
                <h4 className="text-sm font-black text-[#081022] mb-1.5">
                  CE
                </h4>
                <p className="text-xs text-[#5B6776] leading-relaxed">
                  Label Of Compliance With European Community Requirements, Validating Safety, Performance, And Quality For Clinical Use In EU Countries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. DISCOVER OUR PRODUCT LINE (Categories at Bottom)      */}
      {/* ======================================================== */}
      <section className="bg-[#EFEEEC] py-14 sm:py-20 lg:py-28 px-4 sm:px-8 border-b border-zinc-200">
        <div className="max-w-[1400px] 2xl:max-w-[1600px] mx-auto space-y-12">
          {/* Header with Navy/Orange Dual Accent Line */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-1 mb-2">
              <span className="w-8 h-1 bg-[#081022] rounded-full" />
              <span className="w-8 h-1 bg-[#F6851F] rounded-full" />
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#081022] tracking-tight">
              {productLine.title}
            </h2>

            <p className="text-xs sm:text-sm text-[#5B6776] max-w-2xl mx-auto leading-relaxed">
              {productLine.subtitle}
            </p>
          </div>

          {/* 4 Category Cards using Rectangle 819 (1).svg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {productLine.categories.map((cat: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-2xl overflow-hidden border border-zinc-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image using Rectangle 819 (1).svg */}
                <div className="relative w-full aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <Image
                    src={cat.image || '/Rectangle 819 (1).svg'}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Footer and Button */}
                <div className="p-5 space-y-4 flex flex-col justify-between flex-1">
                  <h4 className="text-sm sm:text-base font-bold text-[#081022] leading-snug group-hover:text-[#F6851F] transition-colors">
                    {cat.name}
                  </h4>

                  <div>
                    <Link
                      href={cat.link || '/products'}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07312] text-white text-xs sm:text-sm font-bold shadow-md shadow-orange-500/20 transition-all duration-200"
                    >
                      <span>Our Collection</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
