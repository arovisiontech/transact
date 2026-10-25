'use client'

import React from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { Briefcase, MapPin, Clock, ArrowRight, ShieldCheck, Award } from 'lucide-react'

export default function CareersPage() {
  const jobs = [
    {
      title: 'CNC 5-Axis Programmer & Master Machinist',
      department: 'Tooling & CNC Engineering',
      location: 'Sialkot Facility, Pakistan',
      type: 'Full-Time',
      desc: 'Program and optimize CAD/CAM cutting paths on multi-axis robotic milling centers for delicate surgical instruments.',
    },
    {
      title: 'Quality Assurance & Regulatory Auditor',
      department: 'Quality & Compliance',
      location: 'Sialkot Facility, Pakistan',
      type: 'Full-Time',
      desc: 'Maintain ISO 13485:2016 protocols, conduct batch non-conformance testing, and manage technical device master records.',
    },
    {
      title: 'International Export Sales Manager (EMEA & Americas)',
      department: 'Global Sales',
      location: 'Chicago, USA or Hybrid',
      type: 'Full-Time',
      desc: 'Manage relationships with hospital procurement consortiums and medical wholesale distributors in North America and Europe.',
    },
    {
      title: 'Senior Master Cutler & Instrument Setter',
      department: 'Production & Finishing',
      location: 'Sialkot Facility, Pakistan',
      type: 'Full-Time',
      desc: 'Hand calibration of surgical scissor action, TC jaw soldering, and microscopic joint tensioning.',
    },
  ]

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Work with Us
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Careers at Transact International
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Join a passionate team of metallurgical engineers, precision machinists, and international trade professionals shaping surgical healthcare worldwide.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#081022]">Open Positions</h2>
            <p className="text-xs text-[#4B5D71]">We offer competitive international compensation, continuous skill training, and career progression.</p>
          </div>

          <div className="space-y-4">
            {jobs.map((j, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-sm transact-card flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#FFF4EB] text-[#F6851F] font-bold text-[10px] uppercase">
                      {j.department}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#F6851F]" /> {j.location}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" /> {j.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#081022]">
                    {j.title}
                  </h3>

                  <p className="text-xs text-[#4B5D71] leading-relaxed">
                    {j.desc}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="px-6 py-2.5 bg-[#081022] hover:bg-[#0D3969] text-white text-xs font-bold rounded-xl transition shadow flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-2xl bg-white border border-zinc-200 text-center space-y-2">
            <h4 className="text-sm font-bold text-[#081022]">Don&apos;t see an exact match?</h4>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              We always look for exceptional engineering and trade talent. Send your CV directly to <span className="text-[#F6851F] font-semibold">careers@transactintl.com</span>.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
