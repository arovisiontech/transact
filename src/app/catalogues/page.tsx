'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  Download,
  FileText,
  BookOpen,
  Eye,
  X,
  ClipboardCheck,
  Tag,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { CatalogueItem } from '@/src/types'

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null)
  const [viewingPdfTitle, setViewingPdfTitle] = useState<string>('')

  useEffect(() => {
    async function loadCatalogues() {
      try {
        const res = await fetch('/api/catalogues', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setCatalogues(data.filter((c: CatalogueItem) => c.is_published !== false))
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch catalogues:', err)
      }

      // Fallback default
      import('@/src/data/catalogues.json').then((mod) => {
        setCatalogues(mod.default as unknown as CatalogueItem[])
      })
    }

    loadCatalogues()
  }, [])

  const categories = [
    'ALL',
    'LARYNGOSCOPE',
    'DIAGNOSTICS',
    'COMPANY PROFILE',
  ]

  const filtered = catalogues.filter((cat) => {
    if (selectedCategory === 'ALL') return true
    return cat.category?.toUpperCase() === selectedCategory.toUpperCase() ||
      cat.title?.toUpperCase().includes(selectedCategory.toUpperCase())
  })

  return (
    <PublicShell>
      {/* Hero Section */}
      <section className="bg-white pt-10 pb-6 px-4 sm:px-8 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs font-semibold mb-6">
            <Link href="/" className="text-zinc-500 hover:text-zinc-800 transition">
              Home
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-[#F6851F]">Catalogue</span>
          </nav>

          {/* Centered Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#081022] text-center tracking-tight uppercase">
            BUILT TO PERFORM. MADE TO LAST.
          </h1>
        </div>
      </section>

      {/* Category Bar matching SVG */}
      <section className="bg-white py-6 px-4 sm:px-8 border-b border-zinc-100 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#F6851F] flex items-center justify-center text-white shadow-md shadow-[#F6851F]/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-sm font-extrabold text-[#081022] tracking-wider uppercase">
              PRODUCT CATALOG
            </span>
          </div>

          {/* Divider Line in SVG */}
          <div className="hidden md:block flex-1 h-[1px] bg-zinc-200 mx-4 max-w-xs" />

          {/* Filter Categories with orange slashes */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-extrabold tracking-wide uppercase">
            {categories.map((cat, idx) => (
              <React.Fragment key={cat}>
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`transition-colors py-1 px-2 rounded-lg cursor-pointer ${
                    selectedCategory === cat
                      ? 'text-[#F6851F] font-black'
                      : 'text-zinc-700 hover:text-[#F6851F]'
                  }`}
                >
                  {cat}
                </button>
                {idx < categories.length - 1 && (
                  <span className="text-[#F6851F] font-bold select-none">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue Cards Grid */}
      <section className="py-12 px-4 sm:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-zinc-200 shadow-sm">
              <BookOpen className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-[#081022]">No Catalogues Found</h3>
              <p className="text-xs text-zinc-500 mt-1">Try selecting ALL to view our full collection.</p>
              <button
                onClick={() => setSelectedCategory('ALL')}
                className="mt-4 px-4 py-2 bg-[#F6851F] text-white rounded-xl text-xs font-bold"
              >
                Show All Catalogues
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filtered.map((cat, index) => {
                const coverImage = cat.cover_image || '/images/catalogues/laryngoscope-cover.webp'
                const pdfUrl = cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'

                return (
                  <div
                    key={cat.id || index}
                    className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-6 sm:p-8 flex flex-col justify-between"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                      {/* Left: Info & Actions */}
                      <div className="sm:col-span-7 flex flex-col justify-between space-y-4">
                        {/* Reference Badge */}
                        <div>
                          <span className="inline-block px-3.5 py-1 rounded-full bg-[#EEF2F6] text-[#081022] text-xs font-extrabold tracking-wider uppercase">
                            {cat.catalog_number || 'CATALOG 01'}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl font-black text-[#081022] tracking-tight uppercase">
                          {cat.title}
                        </h2>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed line-clamp-4">
                          {cat.description ||
                            'Our Laryngoscope Range Is Engineered To Support Safe, Efficient, And Dependable Airway Management. Manufactured With Precision-Grade Materials And Advanced Optical Technology, Each Instrument Delivers Excellent Illumination, Smooth Handling, And Consistent Performance For Healthcare Professionals.'}
                        </p>

                        {/* Divider Line */}
                        <div className="h-[1px] bg-zinc-200 w-full" />

                        {/* Buttons Side by Side matching SVG */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              setViewingPdfUrl(pdfUrl)
                              setViewingPdfTitle(cat.title)
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2 cursor-pointer"
                          >
                            <FileText className="w-4 h-4" />
                            <span>View Catalog</span>
                          </button>

                          <a
                            href={pdfUrl}
                            download
                            className="px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-50 text-[#081022] text-xs font-bold border border-[#081022] transition flex items-center gap-2"
                          >
                            <span>Download PDF</span>
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Right: 3D Book Mockup */}
                      <div className="sm:col-span-5 flex items-center justify-center">
                        <div className="relative w-48 sm:w-56 h-64 sm:h-72 drop-shadow-2xl hover:scale-105 transition-transform duration-300">
                          <Image
                            src={coverImage}
                            alt={`${cat.title} 3D Cover`}
                            fill
                            unoptimized
                            className="object-contain"
                            priority={index < 2}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Section: BUILT TO PERFORM. MADE TO LAST. (4 Cards matching SVG) */}
      <section className="py-16 px-4 sm:px-8 bg-white border-t border-zinc-200">
        <div className="max-w-7xl mx-auto space-y-10">
          <h2 className="text-2xl sm:text-3xl font-black text-[#081022] text-center tracking-tight uppercase">
            BUILT TO PERFORM. MADE TO LAST.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Product Catalogs */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-center text-[#F6851F] shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-[#081022]">Product Catalogs</h3>
              </div>
              <p className="text-xs text-[#4B5D71] leading-relaxed">
                Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And Professional Use.
              </p>
              <Link
                href="/catalogues"
                className="text-xs font-bold text-[#F6851F] hover:text-[#E07314] inline-flex items-center gap-1 transition"
              >
                <span>View Catalogs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 2: Quality Standards */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-center text-[#F6851F] shrink-0">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-[#081022]">Quality Standards</h3>
              </div>
              <p className="text-xs text-[#4B5D71] leading-relaxed">
                Manufactured to DIN and ISO/ASTM Standards with strict quality control to ensure reliability and safety.
              </p>
              <Link
                href="/about#quality"
                className="text-xs font-bold text-[#F6851F] hover:text-[#E07314] inline-flex items-center gap-1 transition"
              >
                <span>View Standards</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 3: OEM / Private Label */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-center text-[#F6851F] shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-[#081022]">OEM / Private Label</h3>
              </div>
              <p className="text-xs text-[#4B5D71] leading-relaxed">
                Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To Your Business Needs.
              </p>
              <Link
                href="/production"
                className="text-xs font-bold text-[#F6851F] hover:text-[#E07314] inline-flex items-center gap-1 transition"
              >
                <span>View OEM Solutions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Card 4: Materials & Sterilization */}
            <div className="p-6 rounded-2xl border border-zinc-200 bg-white hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/20 flex items-center justify-center text-[#F6851F] shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-[#081022]">Materials & Sterilization</h3>
              </div>
              <p className="text-xs text-[#4B5D71] leading-relaxed">
                Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO Sterilized Configurations.
              </p>
              <Link
                href="/production"
                className="text-xs font-bold text-[#F6851F] hover:text-[#E07314] inline-flex items-center gap-1 transition"
              >
                <span>View Materials</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Viewing Modal */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-700">
            <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#F6851F]" />
                <h3 className="text-base font-bold">{viewingPdfTitle} - Digital Catalog</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={viewingPdfUrl}
                  download
                  className="px-4 py-2 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold flex items-center gap-2 transition shadow"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
                <button
                  onClick={() => setViewingPdfUrl(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900">
              <iframe
                src={viewingPdfUrl}
                className="w-full h-full border-none"
                title={viewingPdfTitle}
              />
            </div>
          </div>
        </div>
      )}
    </PublicShell>
  )
}
