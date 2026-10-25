'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      {/* Hero Section with image 333.svg */}
      <section className="relative bg-[#081022] text-white overflow-hidden py-20 sm:py-28 border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 333.svg"
            alt="Transact Privacy Banner"
            fill
            unoptimized
            className="object-cover object-right opacity-45 pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#081022] via-[#081022]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081022] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 text-center sm:text-left">
          <nav aria-label="Breadcrumb" className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold mb-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <span className="text-zinc-500">/</span>
            <span className="text-[#F6851F]">Privacy Policy</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] block mb-2">
            Data Protection & Security
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Privacy Policy
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-3 leading-relaxed">
            Our corporate commitment to safeguarding institutional, technical, and procurement data across all interactions.
          </p>
          <span className="text-[11px] text-zinc-400 block mt-2 font-mono">
            Last Updated: October 2026
          </span>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-3 text-[#081022]">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/30 flex items-center justify-center text-[#F6851F]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">1. Introduction & Overview</h2>
            </div>
            <p>
              Transact International is dedicated to protecting the privacy of healthcare professionals, institutional buyers, and business partners. This Privacy Policy outlines our standards concerning the collection, storage, and processing of organizational and personal data when accessing our online catalog and submitting Requests for Quotations (RFQs).
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">2. Information We Collect</h2>
            <p>
              We collect information provided directly by institutional representatives, including names, official email addresses, hospital or company names, destination delivery ports, phone numbers, and procurement specifications. We do not sell or lease your procurement information to third-party marketing firms.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">3. Use of Information</h2>
            <p>
              Collected information is strictly utilized to generate proforma invoices, prepare technical metallurgical certifications, schedule customs clearance documentation, and coordinate air or ocean freight.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">4. Data Protection & Security</h2>
            <p>
              We maintain commercial-grade SSL encryption and secure server access controls compliant with modern cybersecurity guidelines. Authorized personnel only have access to active customer inquiry registries.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">5. Contact Us</h2>
            <p>
              For inquiries regarding data privacy compliance, please email our legal department at{' '}
              <a href="mailto:info@transactintl.com" className="text-[#F6851F] font-bold hover:underline">
                info@transactintl.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
