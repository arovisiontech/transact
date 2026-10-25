'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, ShieldCheck, CheckCircle2, Cpu, Wrench, Layers } from 'lucide-react'

export default function VideoWhyChooseSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  const capabilities = [
    {
      icon: Cpu,
      title: '5-Axis CNC Milling',
      desc: 'Micron-level computerized shaping ensures identical symmetry for delicate microsurgical tips and scissor blades.',
    },
    {
      icon: Wrench,
      title: 'Cryogenic Heat Treatment',
      desc: 'Controlled atmospheric tempering achieves balanced Rockwell hardness (HRC 50±2) without brittle stress points.',
    },
    {
      icon: ShieldCheck,
      title: 'ASTM Passivation',
      desc: 'Acid bath treatment removes free iron and builds an ultra-dense chromium oxide protective layer against autoclave corrosion.',
    },
    {
      icon: Layers,
      title: 'Class 10k Cleanroom',
      desc: 'Ultrasonic multi-stage washing with reverse osmosis water and cleanroom sterile packaging for immediate surgical use.',
    },
  ]

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#F5F4F3] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-3.5 py-1 rounded-full border border-[#F6851F]/30">
            Manufacturing Prowess
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081022] tracking-tight">
            Advanced Engineering & Artisanal Craftsmanship
          </h2>
          <p className="text-sm text-[#4B5D71] leading-relaxed">
            Take a virtual tour through our modern facility and see how Transact International transforms raw medical steel into world-class surgical instruments.
          </p>
        </div>

        {/* Video Tour Banner Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-[#081022] aspect-[21/9] min-h-[300px] sm:min-h-[420px] flex items-center justify-center border-4 border-white">
          <Image
            src="/images/transact/image3_3812_2.png"
            alt="Transact International Virtual Facility Tour"
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081022] via-transparent to-[#081022]/40" />

          {/* Interactive Play Button */}
          <div className="relative z-10 text-center space-y-4 px-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label="Play virtual facility tour"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#F6851F] hover:bg-[#E07314] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all mx-auto group"
            >
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
            </button>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                Inside the Transact Precision Plant
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                Virtual Video Showcase • Drop Forging, CNC Machining & Micro-Finishing
              </p>
            </div>
          </div>
        </div>

        {/* 4 Technical Advantages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {capabilities.map((cap, i) => {
            const Icon = cap.icon
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm transact-card space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] text-[#F6851F] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-[#081022]">{cap.title}</h4>
                <p className="text-xs text-[#4B5D71] leading-relaxed">{cap.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
