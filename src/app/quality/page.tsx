'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck2,
  Microscope,
  Cpu,
  Layers,
  ArrowRight,
  Mail,
  Download,
} from 'lucide-react'

export default function QualityPage() {
  const qualityPillars = [
    {
      icon: Layers,
      title: 'Premium Medical-Grade Alloys',
      description:
        'Forged exclusively from German DIN 1.4021 / 1.4117 and Japanese AISI 420/440A stainless steel alloys conforming strictly to ASTM F899 specifications.',
    },
    {
      icon: Cpu,
      title: 'Precision Micro-Machining',
      description:
        'Multi-axis CNC milling and automated EDM tooling achieve tolerances within ±0.02mm, ensuring consistent jaw serrations, box locks, and joint alignment.',
    },
    {
      icon: Microscope,
      title: 'Vacuum Heat Treatment',
      description:
        'Atmosphere-controlled heat treatment and deep cryogenic tempering yield optimal Rockwell hardness (HRC 48-52), balancing resilience with edge longevity.',
    },
    {
      icon: ShieldCheck,
      title: 'Passivation & Rust Immunity',
      description:
        'Multi-tank ultrasonic degreasing and chemical nitric/citric acid passivation develop an impenetrable chromium oxide passive film resistant to harsh autoclaving.',
    },
  ]

  const testingProtocols = [
    {
      code: 'ASTM F1089',
      name: 'Boil & Corrosion Resistance Testing',
      details:
        'Instruments undergo extended immersion in boiling distilled water followed by exposure cycles to confirm total resistance to pitting, staining, and surface oxidation.',
    },
    {
      code: 'ASTM A967',
      name: 'Copper Sulfate Passivation Test',
      details:
        'Chemical verification confirming the complete elimination of free iron residues on all polished and satin-finished instrument surfaces.',
    },
    {
      code: 'ISO 7153-1',
      name: 'Metallurgical & Rockwell Hardness Audit',
      details:
        'Spectrographic alloy composition analysis and diamond cone indentation testing to verify exact carbon, chromium, and molybdenum concentrations.',
    },
    {
      code: 'DIN 58298',
      name: 'Functional & Cutting Edge Verification',
      details:
        'Standardized material shear tests for scissors, needle grip tension tests for holders, and elastic spring recovery tests for forceps.',
    },
  ]

  const certifications = [
    {
      title: 'ISO 13485:2016',
      sub: 'Medical Device Quality Management System',
      description:
        'Comprehensive third-party audited design, manufacturing, inspection, and risk management systems complying with global medical regulatory standards.',
    },
    {
      title: 'CE Marking (EU MDR 2017/745)',
      sub: 'European Medical Device Regulation',
      description:
        'All reusable and single-use surgical instruments meet European health, safety, and environmental protection requirements with full technical documentation.',
    },
    {
      title: 'US FDA Registration',
      sub: '21 CFR Part 820 (QSR / cGMP)',
      description:
        'Establishment registration and Device Listings with the United States Food and Drug Administration, ensuring Good Manufacturing Practice adherence.',
    },
    {
      title: 'UDI & Lot Traceability',
      sub: 'Unique Device Identification',
      description:
        'GS1-compliant laser annealed 2D DataMatrix barcodes for full electronic track-and-trace from raw steel batch to sterile operating theatre.',
    },
  ]

  return (
    <PublicShell>
      {/* Hero Section with image 333.svg */}
      <section className="relative bg-[#081022] text-white overflow-hidden py-24 sm:py-32 border-b border-zinc-800">
        {/* Background Image 333.svg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 333.svg"
            alt="Transact Quality Banner"
            fill
            unoptimized
            className="object-cover object-right opacity-45 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081022] via-[#081022]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081022] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center sm:text-left">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold mb-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <span className="text-zinc-500">/</span>
            <span className="text-[#F6851F]">Quality Standards</span>
          </nav>

          <span className="inline-block px-3 py-1 rounded-full bg-[#FFF4EB]/10 text-[#F6851F] border border-[#F6851F]/30 text-xs font-bold uppercase tracking-wider mb-3">
            ISO 13485:2016 & CE MDR Certified
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase max-w-4xl">
            Devices That Define Quality.
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-4 leading-relaxed">
            Manufactured to DIN and ISO/ASTM standards with strict metallurgical control, multi-stage passivation, and 100% individual inspection before clinical release.
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-8">
            <Link
              href="/catalogues"
              className="px-6 py-3 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2"
            >
              <span>Download Product Catalogues</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/production"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition"
            >
              Explore Manufacturing Process
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Pillars Section */}
      <section className="py-20 px-4 sm:px-8 bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">
              Foundations of Excellence
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#081022] tracking-tight uppercase">
              Rigorous Manufacturing & Metallurgy
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
              Every instrument carrying the Transact International mark is the product of specialized toolmaking traditions merged with state-of-the-art precision engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {qualityPillars.map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <div
                  key={i}
                  className="p-6 rounded-3xl border border-zinc-200/80 bg-white hover:border-[#F6851F]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-center text-[#F6851F]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#081022]">{pillar.title}</h3>
                    <p className="text-xs text-[#4B5D71] leading-relaxed mt-2">
                      {pillar.description}
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-[#F6851F] uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verified Standard</span>
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testing Protocols Section */}
      <section className="py-20 px-4 sm:px-8 bg-[#F8FAFC] border-b border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">
                Laboratory Verification
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#081022] tracking-tight uppercase">
                Testing Protocols & Quality Audits
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5D71]">
                Every production lot is subjected to destructive and non-destructive laboratory tests to assure uncompromising patient safety.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testingProtocols.map((t, i) => (
              <div
                key={i}
                className="p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="px-3 py-1 rounded-full bg-[#081022] text-[#F6851F] font-mono text-xs font-bold">
                    {t.code}
                  </span>
                  <Award className="w-5 h-5 text-[#F6851F]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#081022]">{t.name}</h3>
                  <p className="text-xs sm:text-sm text-[#4B5D71] mt-2 leading-relaxed">
                    {t.details}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Lot Release Criterion</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-20 px-4 sm:px-8 bg-white border-b border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">
              Global Conformance
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#081022] tracking-tight uppercase">
              International Accreditations
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
              Certified to meet the strictest regulatory bodies across North America, the European Union, the Middle East, and Asia-Pacific.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((c, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-[#FAFAFC] border border-zinc-200 flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-md transition"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center text-[#F6851F] shadow-sm mb-4">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-black text-[#081022]">{c.title}</h3>
                  <span className="text-[11px] font-bold text-[#F6851F] block mt-0.5">{c.sub}</span>
                  <p className="text-xs text-[#4B5D71] mt-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#081022] text-white p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] block">
                Technical Documentation & Audits
              </span>
              <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Require Mill Test Reports Or A Formal Audit?
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                We provide complete lot Certificate of Conformity (CoC), material chemical composition sheets, and welcome scheduled distributor quality audits.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <Link
                href="/contact"
                className="px-6 py-3.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F6851F]/30 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Quality Assurance</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
