'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function OrderProcessSection() {
  const steps = [
    {
      num: '01',
      title: 'Forging & Machining',
      desc: 'High-energy precision drop forging dies create solid grain structure followed by 5-axis robotic CNC milling.',
      icon: '/Forging & Machining-icon 1 (1).svg',
    },
    {
      num: '02',
      title: 'Heat Treatment',
      desc: 'Vacuum furnace thermal hardening and cryogenic quenching calibrate Rockwell hardness to 50-54 HRC.',
      icon: '/Heat Treatment-icon 1.svg',
    },
    {
      num: '03',
      title: 'Finishing & Polishing',
      desc: 'Artisanal micro-grinding, satin anti-reflective electro-polishing, and ultrasonic debris decontamination.',
      icon: '/Finishing-Polishing-icon 1 (1).svg',
    },
    {
      num: '04',
      title: 'Artisanal Assembly',
      desc: 'Master hand setting of box locks, precision alignment of jaws, and smooth spring ratchet tension calibration.',
      icon: '/Assembly-icon 1.svg',
    },
    {
      num: '05',
      title: 'Inspection Process',
      desc: '100% optical microscope inspection, copper sulfate boil testing for zero passivation defects, and corrosion resistance.',
      icon: '/Inspection Process-icon 1.svg',
    },
    {
      num: '06',
      title: 'Packing & Sterilization',
      desc: 'Cleanroom biological testing, laser UDI serialization etching, and sterile medical blister packaging for export.',
      icon: '/Packing & Sterilization-icon 1 (1).svg',
    },
  ]

  return (
    <section className="py-20 2xl:py-28 px-4 sm:px-8 bg-[#EDF2F9] border-t border-zinc-200">
      <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl 2xl:max-w-3xl">
            <span className="text-xs 2xl:text-sm font-bold uppercase tracking-wider text-[#F6851F] bg-white px-3.5 py-1 rounded-full border border-[#F6851F]/30 shadow-sm">
              Standard Operating Procedure
            </span>
            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
              Our 6-Stage Precision Manufacturing Workflow
            </h2>
            <p className="text-sm 2xl:text-base text-[#4B5D71]">
              Every single instrument manufactured by Transact International passes through an uncompromised chain of metallurgical precision.
            </p>
          </div>

          <Link
            href="/production"
            className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold text-[#F6851F] hover:text-[#E07314] transition shrink-0 group cursor-pointer"
          >
            <span>Explore Technical Machinery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="relative p-6 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:shadow-md hover:border-[#F6851F]/40 transition-all duration-300 space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 p-2.5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <span className="text-2xl 2xl:text-3xl font-black text-zinc-300 font-mono">
                  {step.num}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base 2xl:text-lg font-bold text-[#081022] group-hover:text-[#F6851F] transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs 2xl:text-sm text-[#4B5D71] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
