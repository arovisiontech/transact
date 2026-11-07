'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { getStoredImpactNumbers, ImpactNumbersData } from '@/src/lib/dataStore'

export default function ImpactNumbersSection() {
  const [data, setData] = useState<ImpactNumbersData>(getStoredImpactNumbers())

  const reloadData = () => {
    setData(getStoredImpactNumbers())
  }

  useEffect(() => {
    reloadData()
    window.addEventListener('transact_data_updated', reloadData)
    return () => window.removeEventListener('transact_data_updated', reloadData)
  }, [])

  const stats = data.stats || []

  return (
    <section className="bg-white border-b border-zinc-200/80 shadow-xs relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 items-center">
          {/* Left Title Box */}
          <div className="relative pl-4 border-l-4 border-[#F6851F] flex flex-col justify-center py-1">
            {/* Subtle decorative dot pattern in background */}
            <div 
              className="absolute -left-2 top-0 bottom-0 w-44 opacity-25 pointer-events-none -z-10"
              style={{
                backgroundImage: 'radial-gradient(#081022 1px, transparent 1px)',
                backgroundSize: '7px 7px',
              }}
            />
            <h3 className="text-sm sm:text-base font-black tracking-wider leading-tight text-[#081022] uppercase">
              {data.eyebrow || 'OUR IMPACT'} <br />
              <span className="text-[#1B5BFF]">{data.eyebrow_accent || 'IN NUMBERS'}</span>
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium leading-snug mt-1">
              {data.tagline || 'Delivering Quality, Building Healthier Tomorrow.'}
            </p>
          </div>

          {/* 4 Stats */}
          {stats.map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3.5 pl-0 lg:pl-6 ${
                idx > 0 ? 'lg:border-l lg:border-zinc-200' : 'lg:border-l lg:border-zinc-200'
              }`}
            >
              {/* Icon Container */}
              {item.type === 'factory' ? (
                <div className="relative w-12 h-10 shrink-0 flex items-center justify-center p-1 rounded-sm border border-red-200/70 bg-[radial-gradient(#f87171_1px,transparent_1px)] [background-size:5px_5px]">
                  <Image
                    src={item.icon || '/factory-icon 1.svg'}
                    alt={item.label}
                    width={36}
                    height={30}
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="w-12 h-11 shrink-0 flex items-center justify-center">
                  <Image
                    src={item.icon || '/global-icon 1.svg'}
                    alt={item.label}
                    width={38}
                    height={38}
                    unoptimized
                    className="object-contain"
                  />
                </div>
              )}

              {/* Stat text */}
              <div className="flex flex-col">
                <span className="text-2xl xl:text-3xl font-black text-[#081022] tracking-tight leading-none">
                  {item.value}
                </span>
                <span className="text-[11px] xl:text-xs text-[#4B5D71] font-semibold leading-tight mt-1">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
