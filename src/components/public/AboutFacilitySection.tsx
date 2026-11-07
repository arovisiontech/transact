'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getStoredAboutFacility, AboutFacilityData } from '@/src/lib/dataStore'

export default function AboutFacilitySection() {
  const [data, setData] = useState<AboutFacilityData>(getStoredAboutFacility())

  const reloadData = () => {
    setData(getStoredAboutFacility())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  return (
    <section className="bg-white overflow-hidden w-full">
      {/* ── Main split: text left / building image right (Corner-to-Corner on Right side) ── */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-between">
        {/* Left – Text Column with responsive container alignment */}
        <div className="w-full lg:w-1/2 px-5 sm:px-8 lg:pl-12 xl:pl-20 2xl:pl-28 lg:pr-10 py-14 sm:py-16 2xl:py-24 max-w-2xl lg:max-w-none">
          <div className="space-y-5">
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-[#F6851F]">
              <span className="w-2 h-2 rounded-full bg-[#F6851F] shrink-0" />
              <span className="text-xs font-black uppercase tracking-widest">
                {data.eyebrow || 'Since 1990 — ISO 9001 & 13485 Certified'}
              </span>
            </div>

            {/* Heading with mixed color */}
            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] leading-tight tracking-tight">
              {data.title ? (
                <>
                  Global Manufacturer Of{' '}
                  <span className="text-[#F6851F]">
                    {data.title_highlight || 'Laryngoscopes, Blades,'}
                  </span>{' '}
                  And Airway Management Instruments
                </>
              ) : (
                'Global Manufacturer Of Laryngoscopes, Blades, And Airway Management Instruments'
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#4B5D71] leading-relaxed">
              {data.paragraph_1 ||
                'At Transact International, Quality Is Not Just A Standard — It Is Our Foundation. We Are Dedicated To Crafting Laryngoscope & Diagnostics Instruments That Embody Precision, Performance, And Trust. Every Product We Manufacture Undergoes Rigorous Inspection And Testing To Ensure It Meets The Highest International Benchmarks For Safety, Reliability, And Efficiency.'}
            </p>

            <p className="text-sm text-[#4B5D71] leading-relaxed">
              {data.paragraph_2 ||
                'Our Commitment To Excellence Is Deeply Embedded In Every Stage Of Our Process, Ensuring That Healthcare Professionals Receive Instruments They Can Rely On With Complete Confidence.'}
            </p>

            {/* Feature bullets */}
            <div className="space-y-2 pt-2">
              {(
                data.checklist || [
                  'State-of-the-art CNC Machining & Drop Forging Units',
                  'Dedicated Passivation & Ultrasonic Decontamination Line',
                  '100% Dimensional & Rockwell Hardness Testing (HRC 50-54)',
                  'Class 10,000 Cleanroom Sterile Packing Facility',
                  'Custom Laser Marking, Barcoding & UDI Tracking',
                ]
              ).map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-[#081022]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F6851F] shrink-0 mt-1.5" />
                  <span className="font-medium">{point}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link
                href={data.button_link || '/about'}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#081022] hover:bg-[#0D3969] text-white text-sm font-bold rounded-full transition shadow-md group"
              >
                <span className="w-6 h-6 rounded-full bg-[#F6851F] flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3 h-3 text-white" />
                </span>
                <span>{data.button_text || 'About Us More'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right – Building image Corner-to-Corner flush to right edge (SS 1) */}
        <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[460px] lg:h-[580px] 2xl:h-[640px] pr-0 overflow-hidden">
          {/* Orange diagonal accent strip (top-right corner) */}
          <div
            className="absolute top-0 right-0 w-2/5 h-full bg-[#F6851F] z-0"
            style={{ clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%, 0% 100%)' }}
          />

          {/* Building photo corner-to-corner (flush to right border, rounded-l-3xl, rounded-r-none) */}
          <div className="relative z-10 w-full h-full rounded-l-2xl sm:rounded-l-3xl lg:rounded-l-[36px] rounded-r-none overflow-hidden shadow-2xl border-y-4 border-l-4 border-r-0 border-white">
            <Image
              src={data.image_url || '/building-jpg 1.svg'}
              alt="Transact International Facility"
              fill
              unoptimized
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Transact logo badge on building */}
          <div className="absolute top-6 right-6 z-20 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-zinc-200 flex items-center gap-2">
            <Image
              src="/Asset 27 1.svg"
              alt="Transact International"
              width={80}
              height={24}
              unoptimized
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
