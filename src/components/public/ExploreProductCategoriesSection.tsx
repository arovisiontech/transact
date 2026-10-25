'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Layers } from 'lucide-react'
import { getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types'

export default function ExploreProductCategoriesSection() {
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    const loadCategories = () => {
      const cats = getStoredCategories().filter((c) => c.is_published)
      setCategories(cats)
    }
    loadCategories()
    window.addEventListener('transact_data_updated', loadCategories)
    return () => window.removeEventListener('transact_data_updated', loadCategories)
  }, [])

  const defaultCategories: CategoryItem[] = [
    {
      id: 'cat-general-surgery',
      parent_id: null,
      name: 'General Surgery',
      slug: 'general-surgery',
      description: 'Precision forged hemostatic forceps, dissecting scissors, needle holders, and retractors.',
      card_image: '/Rectangle 819.svg',
      product_count: 48,
      sort_order: 1,
      is_published: true,
      created_at: '2026-10-23T17:00:00.000Z',
      updated_at: '2026-10-23T17:00:00.000Z',
    },
    {
      id: 'cat-cardio',
      parent_id: null,
      name: 'Cardiovascular & Thoracic',
      slug: 'cardiovascular-thoracic',
      description: 'Atraumatic vascular clamps, micro needle holders, rib spreaders, and vessel cannulas.',
      card_image: '/Rectangle 823.svg',
      product_count: 32,
      sort_order: 2,
      is_published: true,
      created_at: '2026-10-23T17:00:00.000Z',
      updated_at: '2026-10-23T17:00:00.000Z',
    },
    {
      id: 'cat-ortho',
      parent_id: null,
      name: 'Orthopedic & Bone Surgery',
      slug: 'orthopedic-bone',
      description: 'Heavy bone rongeurs, bone cutting forceps, osteotomes, bone holding clamps, and mallets.',
      card_image: '/Rectangle 824.svg',
      product_count: 28,
      sort_order: 3,
      is_published: true,
      created_at: '2026-10-23T17:00:00.000Z',
      updated_at: '2026-10-23T17:00:00.000Z',
    },
    {
      id: 'cat-dental',
      parent_id: null,
      name: 'Dental & Oral Maxillofacial',
      slug: 'dental-oral',
      description: 'Tooth extracting forceps, root elevators, periodontal curettes, and orthodontic pliers.',
      card_image: '/Rectangle 826.svg',
      product_count: 36,
      sort_order: 4,
      is_published: true,
      created_at: '2026-10-23T17:00:00.000Z',
      updated_at: '2026-10-23T17:00:00.000Z',
    },
    {
      id: 'cat-anesthesia',
      parent_id: null,
      name: 'Diagnostic & Anesthesia',
      slug: 'diagnostic-anesthesia',
      description: 'Fiber optic laryngoscopes, clinical otoscopes, ophthalmoscopes, and percussion hammers.',
      card_image: '/Rectangle 839.svg',
      product_count: 20,
      sort_order: 5,
      is_published: true,
      created_at: '2026-10-23T17:00:00.000Z',
      updated_at: '2026-10-23T17:00:00.000Z',
    }
  ]

  const displayList = categories.length >= 5 ? categories.slice(0, 5) : defaultCategories

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#FAFAFC] border-t border-zinc-200/80">
      <div className="max-w-7xl 2xl:max-w-[1800px] mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl 2xl:max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF4EB] border border-[#F6851F]/30 text-[#F6851F] text-xs font-bold tracking-wide uppercase">
              <Layers className="w-3.5 h-3.5" />
              <span>Surgical Specialties</span>
            </div>
            <h2 className="text-3xl sm:text-4xl 2xl:text-5xl font-black text-[#081022] tracking-tight">
              Explore Precision Surgical Instrument Collections
            </h2>
            <p className="text-sm 2xl:text-base text-[#4B5D71] leading-relaxed">
              Explore our hospital-grade medical procedure collections, each engineered to strict clinical tolerances and international standards.
            </p>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs 2xl:text-sm font-bold text-[#F6851F] hover:text-[#E07314] transition shrink-0 group cursor-pointer"
          >
            <span>View All Specialties</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 5 Specialty Category Cards matching Transact INTL HOMEPAGE.svg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {displayList.map((cat, i) => {
            const fallbackImgs = [
              '/Rectangle 819.svg',
              '/Rectangle 823.svg',
              '/Rectangle 824.svg',
              '/Rectangle 826.svg',
              '/Rectangle 839.svg',
            ]
            const imageSrc = cat.card_image || cat.image_url || fallbackImgs[i % 5]

            return (
              <Link
                key={cat.id || cat.slug}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:border-[#F6851F]/50 transition-all duration-300"
              >
                {/* Category Image Box */}
                <div className="relative aspect-[4/3] bg-zinc-100 overflow-hidden">
                  <Image
                    src={imageSrc}
                    alt={cat.name}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-sm text-[10px] font-bold text-[#081022] shadow">
                    {cat.product_count || 24}+ Instruments
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-[#081022] group-hover:text-[#F6851F] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#4B5D71] mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description || 'Precision surgical instruments manufactured to international standards.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-semibold text-[#F6851F]">
                    <span>Browse Collection</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
