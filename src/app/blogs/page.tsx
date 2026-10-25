'use client'

import React from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { BookOpen, ArrowRight, Calendar, User, Tag } from 'lucide-react'

export default function BlogsPage() {
  const blogs = [
    {
      title: 'Care & Autoclave Maintenance of German Stainless Steel Instruments',
      category: 'Sterilization & QA',
      author: 'QA Engineering Team',
      date: 'October 15, 2026',
      snippet: 'Comprehensive guide to ultrasonic cleaning protocols, enzymatic bath immersion, and passivation preservation under repeated 134°C steam sterilization cycles.',
    },
    {
      title: 'Tungsten Carbide (TC) vs Stainless Steel Jaws: Clinical Performance Comparison',
      category: 'Surgical Materials',
      author: 'Dr. Harris Vance',
      date: 'September 28, 2026',
      snippet: 'Why gold-handled TC inserts provide 5x longer cutting longevity and superior suture needle grip in demanding cardiovascular and microsurgical procedures.',
    },
    {
      title: 'Understanding ISO 13485:2016 and CE Mark MDR Compliance for Surgical Exports',
      category: 'Regulatory Affairs',
      author: 'Compliance Officer',
      date: 'August 10, 2026',
      snippet: 'Key requirements for hospital procurement committees when evaluating manufacturer documentation, UDI traceability, and batch quality certificates.',
    },
    {
      title: 'Passivation Testing Protocols: The Copper Sulfate & Boil Method Explained',
      category: 'Metallurgy',
      author: 'Chief Metallurgist',
      date: 'July 22, 2026',
      snippet: 'A deep dive into ASTM F1089 standard testing protocols to detect free iron particles and prevent pitting corrosion in surgical hand instruments.',
    },
  ]

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Clinical Insights & Education
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Surgical Engineering & Clinical Articles
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Expert knowledge on metallurgy, autoclave sterilization, surgical tool care, and international medical device compliance.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((b, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-zinc-200/80 shadow-sm transact-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-500">
                    <span className="px-2.5 py-1 rounded-full bg-[#FFF4EB] text-[#F6851F] font-bold text-[10px] uppercase">
                      {b.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {b.date}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#081022] hover:text-[#F6851F] transition">
                    {b.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                    {b.snippet}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">By {b.author}</span>
                  <Link href="/contact" className="text-[#F6851F] font-bold flex items-center gap-1 hover:underline">
                    Inquire Topic <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
