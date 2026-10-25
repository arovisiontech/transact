'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  ChevronRight,
  ShieldCheck,
  Plus,
  Eye,
  Tag,
  ArrowLeft,
  Package,
} from 'lucide-react'
import { getStoredCategories, getStoredProducts, addToQuoteCart } from '@/src/lib/dataStore'
import { CategoryItem, ProductItem } from '@/src/types'
import InquiryModal from '@/src/components/public/InquiryModal'

function CategoryDetailContent() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const [category, setCategory] = useState<CategoryItem | null>(null)
  const [products, setProducts] = useState<ProductItem[]>([])
  const [inquiryProduct, setInquiryProduct] = useState<ProductItem | null>(null)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)

  useEffect(() => {
    const cats = getStoredCategories()
    const found =
      cats.find((c) => c.slug === slug || c.id === slug) ||
      cats[0]
    setCategory(found)

    const allProds = getStoredProducts().filter((p) => p.is_published)
    const matching = allProds.filter(
      (p) =>
        p.category_id === found?.id ||
        p.category_name?.toLowerCase() === found?.name.toLowerCase()
    )
    setProducts(matching.length > 0 ? matching : allProds.slice(0, 8))
  }, [slug])

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault()
    e.stopPropagation()
    addToQuoteCart(prod, 1)
    setAddedId(prod.id)
    setTimeout(() => setAddedId(null), 2000)
  }

  const handleOpenInquiry = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault()
    e.stopPropagation()
    setInquiryProduct(prod)
    setIsInquiryOpen(true)
  }

  if (!category) {
    return (
      <PublicShell>
        <div className="py-24 text-center">Loading specialty catalog...</div>
      </PublicShell>
    )
  }

  return (
    <PublicShell>
      {/* Category Header */}
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Link href="/" className="hover:text-white transition">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <Link href="/categories" className="hover:text-white transition">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[#F6851F] font-semibold">{category.name}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
            <div className="space-y-2 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
                Surgical Procedure Collection
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {category.name}
              </h1>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                {category.description ||
                  'Precision manufactured surgical instrumentation engineered to ISO 13485 and CE standards.'}
              </p>
            </div>

            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition shrink-0 self-start"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Categories
            </Link>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {products.length} Instruments Available in this Specialty
            </p>
            <span className="text-xs text-zinc-400">AISI 420 Stainless Steel</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((prod, i) => {
              const fallbackImg = `/images/transact/image${(i % 6) + 5}_3812_2.jpg`
              const imageSrc = prod.featured_image || fallbackImg
              const isJustAdded = addedId === prod.id

              return (
                <div
                  key={prod.id}
                  className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm transact-card"
                >
                  <div className="relative aspect-square bg-[#FAFAFC] overflow-hidden p-6 flex items-center justify-center">
                    <Image
                      src={imageSrc}
                      alt={prod.title}
                      fill
                      unoptimized
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* SKU badge */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                      {prod.sku && (
                        <span className="px-2 py-0.5 rounded-md bg-[#081022]/80 text-white text-[10px] font-mono tracking-wider backdrop-blur-sm">
                          {prod.sku}
                        </span>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleOpenInquiry(e, prod)}
                        className="flex-1 py-2 bg-white/95 backdrop-blur-sm hover:bg-white text-[#081022] text-xs font-bold rounded-xl shadow border border-zinc-200 transition"
                      >
                        Quick RFQ
                      </button>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="p-2 bg-[#081022] hover:bg-zinc-800 text-white rounded-xl shadow transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <Link href={`/products/${prod.slug}`}>
                        <h3 className="text-sm font-bold text-[#081022] hover:text-[#F6851F] transition-colors line-clamp-2">
                          {prod.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-[#4B5D71] mt-1 line-clamp-2 leading-relaxed">
                        {prod.short_description || 'High precision stainless steel surgical instrument for operating rooms.'}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-500">
                        {prod.price ? `$${prod.price.toFixed(2)} USD` : 'RFQ Quote'}
                      </span>

                      <button
                        onClick={(e) => handleAddToCart(e, prod)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                          isJustAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FFF4EB] hover:bg-[#F6851F] text-[#F6851F] hover:text-white'
                        }`}
                      >
                        {isJustAdded ? 'Added ✓' : <><Plus className="w-3.5 h-3.5" /> Add to Quote</>}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <InquiryModal
        product={inquiryProduct}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </PublicShell>
  )
}

export default function CategoryDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#081022] text-white flex items-center justify-center py-32">
          <p className="text-sm font-bold tracking-wider text-zinc-400">Loading surgical specialty category...</p>
        </div>
      }
    >
      <CategoryDetailContent />
    </Suspense>
  )
}
