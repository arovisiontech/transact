'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { Cookie, Shield, CheckCircle2, Lock, Settings } from 'lucide-react'

export default function CookiePolicyPage() {
  return (
    <PublicShell>
      {/* Hero Section with image 333.svg */}
      <section className="relative bg-[#081022] text-white overflow-hidden py-20 sm:py-28 border-b border-zinc-800">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 333.svg"
            alt="Transact Banner"
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
            <span className="text-[#F6851F]">Cookie Policy</span>
          </nav>

          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] block mb-2">
            Data Transparency
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Cookie Policy
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-2xl mt-3 leading-relaxed">
            Explaining how Transact International utilizes cookies and similar tracking technologies to enhance your catalog browsing and RFQ procurement experience.
          </p>
          <span className="text-[11px] text-zinc-400 block mt-2 font-mono">
            Last Updated: October 2026
          </span>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-5xl mx-auto space-y-10 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          {/* Section 1 */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#F8FAFC] border border-zinc-200/80 space-y-3">
            <div className="flex items-center gap-3 text-[#081022]">
              <div className="w-9 h-9 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/30 flex items-center justify-center text-[#F6851F]">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-base sm:text-lg font-bold">1. What Are Cookies?</h2>
            </div>
            <p>
              Cookies are small text data files placed on your computer, tablet, or smartphone when accessing our online catalog and web services. They help our server recognize your preferences, maintain your active procurement inquiries in the RFQ cart, and ensure secure communication during B2B interactions.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#081022]">
              2. Categories of Cookies We Utilize
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-[#081022] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#F6851F]" />
                  <span>Essential & Functional Cookies</span>
                </div>
                <p className="text-xs text-[#4B5D71]">
                  Strictly necessary for browsing product catalogs, maintaining selected instrument references in your Quote Cart, and navigating administrative portals.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-[#081022] font-bold text-sm">
                  <Settings className="w-4 h-4 text-[#F6851F]" />
                  <span>Preferences & Interface Settings</span>
                </div>
                <p className="text-xs text-[#4B5D71]">
                  Remember your chosen display preferences, catalog filter settings, and regional currency selections across browser sessions.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-[#081022] font-bold text-sm">
                  <Shield className="w-4 h-4 text-[#F6851F]" />
                  <span>Performance & Site Analytics</span>
                </div>
                <p className="text-xs text-[#4B5D71]">
                  Anonymously evaluate traffic patterns, page load speeds, and popular medical instrument categories to continuously optimize navigation for healthcare professionals.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-zinc-200 bg-white space-y-2">
                <div className="flex items-center gap-2 text-[#081022] font-bold text-sm">
                  <Lock className="w-4 h-4 text-[#F6851F]" />
                  <span>Security & Fraud Prevention</span>
                </div>
                <p className="text-xs text-[#4B5D71]">
                  Detect malicious automated requests, prevent cross-site request forgery, and protect confidential hospital procurement inquiries.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">3. Third-Party Technologies</h2>
            <p>
              We do not permit third-party advertising networks to track your clinical purchasing habits for behavioral advertising. Third-party integrations (such as Google Fonts or Web CDN providers) may store necessary connection logs strictly to deliver fast, secure page assets.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">4. How to Manage or Disable Cookies</h2>
            <p>
              You can configure your web browser (Chrome, Edge, Safari, Firefox) to block or delete cookies at any time via your browser settings. Please note that disabling essential cookies may prevent quote cart items from persisting and could degrade catalog navigation.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-[#081022]">5. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or technical data policies, please reach our compliance desk at{' '}
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
