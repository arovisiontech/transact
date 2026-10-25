'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Download, FileText, ArrowRight, Eye, BookOpen } from 'lucide-react'
import { getStoredCatalogues } from '@/src/lib/dataStore'
import { CatalogueItem } from '@/src/types'

export default function DownloadableCataloguesSection() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])

  useEffect(() => {
    const cats = getStoredCatalogues().filter((c) => c.is_published)
    setCatalogues(cats)
  }, [])

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#F9FAFB] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-3.5 py-1 rounded-full border border-[#F6851F]/30">
              Technical Resources
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081022] tracking-tight">
              Download Official Surgical Instrument Catalogues
            </h2>
            <p className="text-sm text-[#4B5D71]">
              Comprehensive technical PDF editions featuring instrument patterns, scale drawings, tungsten carbide inserts, and clinical cross-references.
            </p>
          </div>

          <Link
            href="/catalogues"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F6851F] hover:text-[#E07314] transition shrink-0 group"
          >
            <span>View All PDF Editions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Catalogues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogues.slice(0, 6).map((cat, i) => {
            const fallbackCover = `/images/transact/image${(i % 5) + 6}_3812_2.jpg`
            const cover = cat.cover_image || fallbackCover

            return (
              <div
                key={cat.id}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm transact-card"
              >
                {/* Cover Preview Container */}
                <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                  <Image
                    src={cover}
                    alt={cat.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#081022]/90 backdrop-blur-sm text-white text-[10px] font-mono tracking-wider">
                      {cat.catalog_number || `VOL-0${i + 1}`}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold text-[#F6851F] uppercase tracking-wider block">
                      {cat.category || 'Specialty Catalogue'}
                    </span>
                    <h3 className="text-base font-bold text-white truncate drop-shadow-md">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                {/* Info Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-[#4B5D71] line-clamp-2 leading-relaxed">
                    {cat.description || 'Complete technical guide with diagrams, standard sizes, and ordering specifications.'}
                  </p>

                  <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                    <span>{cat.pages || 48} Pages • {cat.file_size || '3.2 MB'}</span>

                    <a
                      href={cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'}
                      download
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF4EB] hover:bg-[#F6851F] text-[#F6851F] hover:text-white font-bold transition text-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
