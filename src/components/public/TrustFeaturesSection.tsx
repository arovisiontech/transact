'use client'

import React from 'react'
import Image from 'next/image'

export default function TrustFeaturesSection() {
  const features = [
    {
      icon: '/reusable-grade 1.svg',
      title: 'Premium Quality Materials',
      description:
        'High-Quality Materials Selected For Superior Durability, Precision, And Long-Lasting Performance.',
    },
    {
      icon: '/Inspection Process-icon 1.svg',
      title: 'Advanced Inspection Process',
      description:
        'Precision Testing And Detailed Inspections At Every Stage To Ensure Consistent Quality And Reliability.',
    },
    {
      icon: '/quality-icon 1 (1).svg',
      title: 'Certified Quality Systems',
      description:
        'Manufactured Under Internationally Recognized Quality Standards For Safety, Consistency, And Performance.',
    },
    {
      icon: '/factory-orange.svg',
      title: 'Modern Manufacturing',
      description:
        'Advanced Manufacturing Facilities Delivering High-Precision Instruments With Consistent Results.',
    },
    {
      icon: '/Global Presence-icon 1.svg',
      title: 'Global Presence',
      description:
        'Trusted By Healthcare Professionals And Partners Across Multiple Countries Worldwide.',
    },
  ]

  return (
    <section className="bg-white py-16 sm:py-20 px-4 sm:px-8 border-b border-zinc-100">
      <div className="max-w-[1440px] mx-auto space-y-12">
        {/* ── Centered Header matching ss 1 ── */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {/* Eyebrow with two horizontal orange lines */}
          <div className="flex items-center justify-center gap-3">
            <span className="w-8 sm:w-12 h-0.5 bg-[#F6851F] rounded-full" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-[#F6851F]">
              Built For Safety. Designed For Excellence.
            </span>
            <span className="w-8 sm:w-12 h-0.5 bg-[#F6851F] rounded-full" />
          </div>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
            Quality You Can Trust, Every Time
          </h2>

          {/* Subheading */}
          <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
            From Raw Material To Final Inspection – Every Step Is Controlled,
            <br className="hidden sm:inline" /> So You Can Focus On What Matters Most: Your Patients
          </p>
        </div>

        {/* ── 5 Cards matching ss 1 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 sm:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 sm:p-7 text-center flex flex-col items-center border border-zinc-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#F6851F]/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Circular Soft-Orange Icon Badge */}
              <div className="w-20 h-20 rounded-full bg-[#FFF5EC] border border-[#F6851F]/15 flex items-center justify-center mb-5 shrink-0 group-hover:scale-105 transition-transform duration-300 p-4">
                <Image
                  src={f.icon}
                  alt={f.title}
                  width={46}
                  height={46}
                  unoptimized
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-base font-bold text-[#081022] leading-snug mb-2.5 group-hover:text-[#F6851F] transition-colors">
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-[#5A6E85] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
