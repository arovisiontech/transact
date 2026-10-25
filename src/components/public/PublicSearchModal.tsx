'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ArrowRight, Package, Tag, ExternalLink } from 'lucide-react'
import { getStoredProducts, getStoredCategories } from '@/src/lib/dataStore'
import { ProductItem, CategoryItem } from '@/src/types'

interface PublicSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PublicSearchModal({ isOpen, onClose }: PublicSearchModalProps) {
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    if (isOpen) {
      setProducts(getStoredProducts())
      setCategories(getStoredCategories().filter((c) => c.is_published))
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.sku?.toLowerCase().includes(query.toLowerCase()) ||
          p.short_description?.toLowerCase().includes(query.toLowerCase()) ||
          p.category_name?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : products.filter((p) => p.is_featured).slice(0, 6)

  const filteredCategories = query.trim()
    ? categories.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 4)
    : categories.slice(0, 4)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-100 bg-[#FAFAFC]">
          <Search className="w-5 h-5 text-[#F6851F] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surgical instruments, SKU code (e.g. SKU-4211), category..."
            className="w-full text-base bg-transparent text-[#081022] placeholder:text-zinc-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 mr-1 text-zinc-400 hover:text-zinc-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
          {/* Categories matches */}
          {filteredCategories.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-2">
                Specialties & Categories
              </p>
              <div className="grid grid-cols-2 gap-2">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-[#FFF4EB] border border-transparent hover:border-[#F6851F]/30 transition-all text-sm font-medium text-[#081022] group"
                  >
                    <Tag className="w-4 h-4 text-[#F6851F]" />
                    <span className="truncate group-hover:text-[#F6851F]">{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Products matches */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-2">
              {query.trim() ? 'Matching Instruments' : 'Featured Precision Instruments'}
            </p>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <Package className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
                <p className="text-sm">No instruments found matching &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-zinc-400 mt-1">Try searching by specialty or SKU code.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredProducts.map((prod) => (
                  <Link
                    key={prod.id}
                    href={`/products/${prod.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-zinc-100 overflow-hidden relative shrink-0 border border-zinc-100">
                      <Image
                        src={prod.featured_image || '/images/transact/image5_3812_2.jpg'}
                        alt={prod.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[#081022] truncate group-hover:text-[#F6851F]">
                          {prod.title}
                        </span>
                        {prod.badge && (
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#FFF4EB] text-[#F6851F] shrink-0">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {prod.sku ? `SKU: ${prod.sku} • ` : ''}
                        {prod.category_name || 'Surgical Instrument'}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#F6851F] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#FAFAFC] border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
          <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-zinc-300 rounded text-[10px]">ESC</kbd> to exit</span>
          <Link
            href="/products"
            onClick={onClose}
            className="text-[#F6851F] hover:underline flex items-center gap-1 font-medium"
          >
            View all instruments <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
