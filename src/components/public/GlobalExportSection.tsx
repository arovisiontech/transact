'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plane, Ship } from 'lucide-react'

export default function GlobalExportSection() {
  const exportDestinations = [
    { country: 'United States', flag: '🇺🇸', code: 'USA Hub' },
    { country: 'Germany', flag: '🇩🇪', code: 'Tuttlingen / DEU' },
    { country: 'United Kingdom', flag: '🇬🇧', code: 'London / GBR' },
    { country: 'United Arab Emirates', flag: '🇦🇪', code: 'Dubai / UAE' },
    { country: 'Japan', flag: '🇯🇵', code: 'Tokyo / JPN' },
    { country: 'Australia', flag: '🇦🇺', code: 'Sydney / AUS' },
    { country: 'Saudi Arabia', flag: '🇸🇦', code: 'Riyadh / KSA' },
    { country: 'Canada', flag: '🇨🇦', code: 'Toronto / CAN' },
    { country: 'Brazil', flag: '🇧🇷', code: 'Sao Paulo / BRA' },
    { country: 'South Africa', flag: '🇿🇦', code: 'Johannesburg / ZAF' },
  ]

  return (
    <section className="py-20 2xl:py-28 px-4 sm:px-8 bg-[#F5F4F3] border-t border-zinc-200">
      <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 2xl:gap-14 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4EB] border border-[#F6851F]/30 text-[#F6851F] text-xs 2xl:text-sm font-bold uppercase tracking-wider">
              <Image
                src="/Global Presence-icon 1.svg"
                alt="Global Presence"
                width={16}
                height={16}
                className="object-contain"
              />
              <span>International Trade & Logistics</span>
            </div>

            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight leading-tight">
              Exporting Surgical Excellence Across 5 Continents & 50+ Nations
            </h2>

            <p className="text-sm 2xl:text-base text-[#4B5D71] leading-relaxed">
              With dedicated customs clearance partnerships, bonded export warehouses, and certified logistics handlers, Transact International provides door-to-door air freight (DHL, FedEx, Emirates SkyCargo) and containerized sea shipments.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 2xl:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <span className="text-2xl 2xl:text-3xl font-black text-[#F6851F] font-mono">50+</span>
                <p className="text-xs font-bold text-[#081022] mt-1">Export Countries</p>
                <p className="text-[11px] text-zinc-500">Global Network</p>
              </div>

              <div className="p-4 2xl:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm">
                <span className="text-2xl 2xl:text-3xl font-black text-[#F6851F] font-mono">1.2M+</span>
                <p className="text-xs font-bold text-[#081022] mt-1">Instruments Shipped</p>
                <p className="text-[11px] text-zinc-500">Annually Worldwide</p>
              </div>

              <div className="p-4 2xl:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm col-span-2 sm:col-span-1">
                <span className="text-2xl 2xl:text-3xl font-black text-[#F6851F] font-mono">99.8%</span>
                <p className="text-xs font-bold text-[#081022] mt-1">Pass Rate</p>
                <p className="text-[11px] text-zinc-500">QA Compliance</p>
              </div>
            </div>

            {/* Logistics Modes with user icons */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-700 pt-2">
              <span className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-zinc-200 shadow-sm">
                <Image
                  src="/global-icon 1.svg"
                  alt="Air Freight"
                  width={16}
                  height={16}
                />
                <span>Express Air Cargo (3-5 Days)</span>
              </span>
              <span className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-xl border border-zinc-200 shadow-sm">
                <Image
                  src="/global-icon 2 (1).svg"
                  alt="Ocean Freight"
                  width={16}
                  height={16}
                />
                <span>Ocean Freight FCL / LCL</span>
              </span>
            </div>
          </div>

          {/* Right Export Hubs Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 2xl:p-10 border border-zinc-200/80 shadow-lg space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] flex items-center justify-center p-2">
                  <Image
                    src="/globe.svg"
                    alt="Globe"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-sm 2xl:text-base font-bold text-[#081022]">Primary Export Hubs</h3>
                  <p className="text-[11px] text-zinc-400">Customs Clearance Verified</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Worldwide Ready
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {exportDestinations.map((dest, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFC] border border-zinc-100 hover:border-[#F6851F]/40 transition group"
                >
                  <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{dest.flag}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#081022] truncate">{dest.country}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">{dest.code}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#081022]">Custom Documentation Provided</p>
                <p className="text-[11px] text-[#4B5D71]">Certificate of Origin, Free Sale, Bill of Lading, Packing List</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
