'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { FileText, Shield, AlertCircle, Scale, CheckCircle2 } from 'lucide-react'

export default function TermsOfUsePage() {
  return (
    <PublicShell>
      {/* Hero Section with image 333.svg */}
      <section className="relative bg-[#081022] text-white overflow-hidden py-20 sm:py-28 border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 333.svg"
            alt="Transact Legal Banner"
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
            <span className="text-[#F6851F]">Terms Of Use</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] block mb-2">
            Commercial & Legal Framework
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Terms Of Use
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-3 leading-relaxed">
            Terms and conditions governing the access, digital catalog inspection, and B2B procurement operations of Transact International.
          </p>
          <span className="text-[11px] text-zinc-400 block mt-2 font-mono">
            Effective Date: October 2026
          </span>
        </div>
      </section>

      {/* Terms Body */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-3 text-[#081022]">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/30 flex items-center justify-center text-[#F6851F]">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">1. Agreement to Terms</h2>
            </div>
            <p>
              By accessing, browsing, or utilizing the web catalog, requesting technical literature, or submitting Requests for Quotations (RFQs) to Transact International, you agree to be legally bound by these Terms of Use and our associated Privacy Policy. If you do not accept these terms, you should refrain from using our digital platforms.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              2. Healthcare Professional & Institutional Use
            </h2>
            <p>
              The surgical instruments, diagnostic sets, and hospital equipment displayed across our website are intended for procurement by licensed healthcare institutions, certified surgical practitioners, accredited medical universities, and authorized medical device distributors. Users are responsible for confirming compliance with their local medical regulatory authorities before clinical deployment.
            </p>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              3. Request for Quotations (RFQ) & Commercial Offers
            </h2>
            <p>
              Submitting an RFQ through our quote cart or inquiry forms does not constitute a binding contract of sale. Official commercial transactions commence once an authorized Transact International commercial representative issues a formal proforma invoice detailing unit pricing, freight tariffs, lead times, and payment terms, which is countersigned by the buyer.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              4. Product Schematics & Technical Tolerances
            </h2>
            <p>
              While we make every effort to display exact pattern measurements, weight, and specifications, surgical toolmaking incorporates precision hand craftsmanship. All instruments adhere to international engineering tolerances established by DIN, ISO, and ASTM medical device standards.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              5. Intellectual Property Rights
            </h2>
            <p>
              All trademarks, product schematics, technical PDFs, 3D renderings, and catalog publications displayed on this website are the proprietary intellectual property of Transact International. Unauthorized reproduction, web scraping, or commercial repurposing without written consent is strictly prohibited.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              6. Limited Warranty & Craftsmanship Guarantee
            </h2>
            <p>
              Transact International warrants its instruments against defects in material and craftsmanship under standard clinical usage and approved hospital autoclaving cycles. Tungsten carbide (TC) inserts feature an extended 3-year warranty against delamination. Instruments subjected to misuse, improper cleaning agents, or unauthorized modification are excluded from warranty coverage.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              7. International Export & Customs Compliance
            </h2>
            <p>
              International shipments are accompanied by Certificate of Origin, Certificate of Conformity (CoC), and commercial customs declarations. The importing party is responsible for local import duties, port tariffs, and national health ministry registrations unless otherwise stipulated in write under Incoterms agreements (e.g., DDP vs. FOB).
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">
              8. Contact & Legal Notifications
            </h2>
            <p>
              Official legal inquiries or notices regarding these terms should be directed to our compliance department at{' '}
              <a href="mailto:info@transactintl.com" className="text-[#F6851F] font-bold hover:underline">
                info@transactintl.com
              </a>{' '}
              or via physical mail to our headquarters: Roras Road Muzaffar Pur, Sialkot - 51310 Pakistan.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
