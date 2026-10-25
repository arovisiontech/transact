'use client'

import React from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { Calendar, ArrowRight, Award, Globe, Building2 } from 'lucide-react'

export default function NewsPage() {
  const newsItems = [
    {
      title: 'Transact International Showcases Micro-Surgical Line at Medica Düsseldorf 2026',
      date: 'October 2026',
      category: 'Exhibitions',
      summary: 'Our executive export delegation presented the new titanium ophthalmic and micro-vascular surgical range at Hall 10, receiving acclaim from hospital procurement groups across Europe.',
    },
    {
      title: 'Expansion of Automated 5-Axis CNC Milling Center in Sialkot Plant',
      date: 'August 2026',
      category: 'Corporate Growth',
      summary: 'Installation of six next-generation robotic machining centers doubles our manufacturing output for fine scissors and self-retaining retractor assemblies.',
    },
    {
      title: 'Attainment of Updated ISO 13485:2016 Recertification with Zero Non-Conformances',
      date: 'May 2026',
      category: 'Quality Accreditations',
      summary: 'Annual surveillance audit completed successfully by international registrar, reaffirming Transact International as a trusted manufacturer for worldwide clinical markets.',
    },
    {
      title: 'North American Distribution Logistics Hub Established in Chicago, IL',
      date: 'January 2026',
      category: 'Global Network',
      summary: 'New inventory fulfillment facility enables 48-hour delivery of high-velocity surgical procedure sets throughout the continental United States and Canada.',
    },
  ]

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Press & Corporate Updates
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Transact International News & Global Events
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Stay informed on international trade exhibitions, facility modernizations, and new product lines from Transact International.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-5xl mx-auto space-y-6">
          {newsItems.map((n, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-zinc-200/80 shadow-sm transact-card space-y-4"
            >
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="px-2.5 py-1 rounded-full bg-[#FFF4EB] text-[#F6851F] font-bold text-[10px] uppercase">
                  {n.category}
                </span>
                <span className="flex items-center gap-1 font-semibold text-zinc-600">
                  <Calendar className="w-3.5 h-3.5 text-[#F6851F]" /> {n.date}
                </span>
              </div>

              <h2 className="text-xl font-bold text-[#081022]">
                {n.title}
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                {n.summary}
              </p>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Published by Corporate Relations</span>
                <Link href="/contact" className="text-[#F6851F] font-bold flex items-center gap-1 hover:underline">
                  Inquire Press Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  )
}
