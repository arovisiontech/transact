'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getStoredPrecisionMfg } from '@/src/lib/dataStore'
import { PrecisionManufacturingSection as PrecisionMfgType } from '@/src/types'

export default function PrecisionManufacturingSection() {
  const [data, setData] = useState<PrecisionMfgType>(getStoredPrecisionMfg())

  const reloadData = () => {
    setData(getStoredPrecisionMfg())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  return (
    <section className="bg-white py-14 sm:py-20 px-4 sm:px-8 border-b border-zinc-100">
      <div className="max-w-[1380px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Left Column: Industrial CNC Milling Machining Image */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full aspect-[16/11] max-w-[620px] rounded-2xl overflow-hidden shadow-xl border border-zinc-200/90 bg-[#081022] group">
              <Image
                src={data.image_url || '/image 352.svg'}
                alt="Precision Manufacturing & Quality Control"
                fill
                unoptimized
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          {/* Right Column: Text & 7-Step Workflow */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow */}
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#F6851F] block">
              {data.eyebrow || 'QUALITY & MANUFACTURING'}
            </span>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl 2xl:text-4xl font-black text-[#081022] tracking-tight leading-tight">
              {data.title_line1 || 'PrecisionManufacturing &'}{' '}
              <span className="text-[#F6851F] block">
                {data.title_line2 || 'Quality Control'}
              </span>
            </h3>

            {/* Description Subtitles */}
            <div className="space-y-1 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
              <p>
                {data.subtitle_p1 ||
                  'Every Transact Instrument Passes Through Carefully Controlled Manufacturing And Inspection Processes.'}
              </p>
              <p className="font-semibold text-[#081022] pt-1">
                {data.subtitle_p2 || 'Our Production Workflow Includes:'}
              </p>
            </div>

            {/* 7-Step Workflow Bar with Orange Chevrons */}
            <div className="pt-2 pb-2">
              <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2 no-scrollbar">
                {data.steps.map((step, idx) => (
                  <React.Fragment key={idx}>
                    <div className="flex flex-col items-center text-center shrink-0 min-w-[64px] sm:min-w-[74px] group">
                      {/* Icon */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110">
                        <Image
                          src={step.icon}
                          alt={step.title.replace('\n', ' ')}
                          width={38}
                          height={38}
                          unoptimized
                          className="object-contain"
                        />
                      </div>

                      {/* Label */}
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#081022] leading-tight whitespace-pre-line text-center group-hover:text-[#F6851F] transition-colors">
                        {step.title}
                      </span>
                    </div>

                    {/* Chevron divider between steps */}
                    {idx < data.steps.length - 1 && (
                      <span className="text-[#F6851F] text-xs sm:text-sm font-black px-0.5 sm:px-1 select-none shrink-0 self-center mb-4">
                        ›
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Footnote */}
            <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed pt-1 border-t border-zinc-100">
              {data.footnote ||
                'We Focus On Consistent Quality, Precise Finishing And Dependable Performance Across Every Product.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
