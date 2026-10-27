'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, ArrowRight, Eye, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { getStoredProducts, addToQuoteCart } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types'
import InquiryModal from './InquiryModal'

interface FeaturedProductsSectionProps {
  onOpenQuote?: () => void
}

export default function FeaturedProductsSection({ onOpenQuote }: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [inquiryProduct, setInquiryProduct] = useState<ProductItem | null>(null)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = () => {
      const prods = getStoredProducts().filter((p) => p.is_published)
      setProducts(prods)
    }
    loadProducts()
    window.addEventListener('transact_data_updated', loadProducts)
    return () => window.removeEventListener('transact_data_updated', loadProducts)
  }, [])

  const filterTabs = [
    { id: 'all', label: 'All Instruments' },
    { id: 'general', label: 'General Surgery' },
    { id: 'cardio', label: 'Cardiovascular' },
    { id: 'ortho', label: 'Orthopedic' },
    { id: 'dental', label: 'Dental & Oral' },
    { id: 'anesthesia', label: 'Diagnostics & Anesthesia' },
  ]

  const filtered =
    activeCategory === 'all'
      ? products.slice(0, 8)
      : products
          .filter((p) => {
            const cat = (p.category_name || '').toLowerCase()
            const catId = (p.category_id || '').toLowerCase()
            return cat.includes(activeCategory) || catId.includes(activeCategory)
          })
          .slice(0, 8)

  const handleAddToCart = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault()
    e.stopPropagation()
    addToQuoteCart(prod, 1)
    setAddedId(prod.id)
    setTimeout(() => setAddedId(null), 2000)
    if (onOpenQuote) {
      setTimeout(() => onOpenQuote(), 300)
    }
  }

  const handleOpenInquiry = (e: React.MouseEvent, prod: ProductItem) => {
    e.preventDefault()
    e.stopPropagation()
    setInquiryProduct(prod)
    setIsInquiryOpen(true)
  }

  return (
    <section className="py-20 px-4 sm:px-8 bg-[#F9FAFB] border-t border-zinc-200">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-3.5 py-1 rounded-full border border-[#F6851F]/30">
              Institutional Selection
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#081022] tracking-tight">
              Featured Surgical & Medical Instruments
            </h2>
            <p className="text-sm text-[#4B5D71]">
              Precision forged from Japanese AISI 420 stainless steel with micro-serrated tips and tungsten carbide inserts.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#F6851F] hover:text-[#E07314] transition shrink-0 group"
          >
            <span>View Complete Store Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-4">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === tab.id
                  ? 'bg-[#081022] text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((prod) => {
            // Stable fallback image based on prod.id hash (not array index)
            const idHash = prod.id ? prod.id.charCodeAt(prod.id.length - 1) % 6 : 0
            const fallbackImg = `/images/transact/image${idHash + 5}_3812_2.jpg`
            const imageSrc = prod.featured_image || fallbackImg
            const isJustAdded = addedId === prod.id

            return (
              <div
                key={prod.id}
                className="group relative flex flex-col bg-white rounded-none rounded-bl-[10px] overflow-hidden border border-zinc-200/80 shadow-sm transact-card"
                style={{ borderRadius: '0px 0px 0px 10px' }}
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-[#FAFAFC] overflow-hidden p-6 flex items-center justify-center">
                  <Image
                    src={imageSrc}
                    alt={prod.title}
                    fill
                    unoptimized
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* SKU & Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                    {prod.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-[#FFF4EB] text-[#F6851F] text-[10px] font-extrabold uppercase shadow-sm">
                        {prod.badge}
                      </span>
                    )}
                    {prod.sku && (
                      <span className="px-2 py-0.5 rounded-md bg-[#081022]/80 text-white text-[10px] font-mono tracking-wider backdrop-blur-sm">
                        {prod.sku}
                      </span>
                    )}
                  </div>

                  {/* Quick Action Overlay */}
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
                      title="Inspect Specifications"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#F6851F] uppercase tracking-wider block mb-1">
                      {prod.category_name || 'Surgical Instrument'}
                    </span>
                    <Link href={`/products/${prod.slug}`}>
                      <h3 className="text-sm font-bold text-[#081022] hover:text-[#F6851F] transition-colors line-clamp-2">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-[#4B5D71] mt-1.5 line-clamp-2 leading-relaxed">
                      {prod.short_description || 'High precision stainless steel surgical instrument for operating rooms.'}
                    </p>
                  </div>

                  {/* Action buttons */}
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
                      {isJustAdded ? (
                        <>Added to RFQ ✓</>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> Add to Quote
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Inquiry Modal */}
      <InquiryModal
        product={inquiryProduct}
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
      />
    </section>
  )
}
