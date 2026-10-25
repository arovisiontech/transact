'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  Grid,
  List as ListIcon,
  Check,
  Shield,
  Award,
  Sparkles,
  Globe2,
  ThumbsUp,
  CheckCircle2,
  Filter,
  X,
} from 'lucide-react'
import { getStoredProducts, addToQuoteCart } from '@/src/lib/dataStore'
import initialProducts from '@/src/data/products.json'
import { ProductItem } from '@/src/types'
import InquiryModal from '@/src/components/public/InquiryModal'

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>(initialProducts as unknown as ProductItem[])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [inquiryProduct, setInquiryProduct] = useState<ProductItem | null>(null)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Single Selection Filter States (default 'all' to show all products by default)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')

  // Load products live from server API & dataStore
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) {
        const liveProds: ProductItem[] = await res.json()
        if (Array.isArray(liveProds)) {
          setProducts(liveProds)
          // Synchronize localStorage so stale cached products are purged
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('transact_products_v2', JSON.stringify(liveProds))
            } catch (e) {}
          }
          setLoading(false)
          return
        }
      }
    } catch (err) {
      console.warn('Live fetch error, falling back to dataStore:', err)
    }

    const localProds = getStoredProducts().filter((p) => p.is_published)
    if (localProds.length > 0) {
      setProducts(localProds)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()

    const handleDataUpdate = () => {
      fetchProducts()
    }

    window.addEventListener('transact_data_updated', handleDataUpdate)
    return () => window.removeEventListener('transact_data_updated', handleDataUpdate)
  }, [])

  // Filtered Products according to active filters
  const filteredProducts = products.filter((prod) => {
    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      const cat = (prod.category_name || '').toLowerCase()
      if (selectedCategory === 'single-use' && !cat.includes('single')) return false
      if (selectedCategory === 'reusable' && !cat.includes('reusable')) return false
    }

    // 2. Type Filter
    if (selectedType && selectedType !== 'all') {
      const pType = (prod.product_type || '').toLowerCase()
      if (selectedType === 'macintosh' && !pType.includes('macintosh')) return false
      if (selectedType === 'miller' && !pType.includes('miller')) return false
      if (selectedType === 'conventional' && !pType.includes('conventional')) return false
      if (selectedType === 'plastic-fiber' && !pType.includes('plastic') && !pType.includes('fiber')) return false
    }

    // 3. Material Filter
    if (selectedMaterial && selectedMaterial !== 'all') {
      const mat = (prod.material || '').toLowerCase()
      if (selectedMaterial === 'stainless-steel' && !mat.includes('stainless') && !mat.includes('steel')) return false
      if (selectedMaterial === 'fiber-optic' && !mat.includes('fiber')) return false
      if (selectedMaterial === 'plastic' && !mat.includes('plastic')) return false
    }

    return true
  })

  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (Matching Transact INTL Products Page.svg) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#EBF3F8] overflow-hidden border-b border-[#D8E6F0]">
        {/* Background visual image 431.svg positioned on the right */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 pointer-events-none select-none overflow-hidden">
          <Image
            src="/image 431.svg"
            alt="Reusable Laryngoscope Instruments"
            fill
            priority
            unoptimized
            className="object-cover object-right opacity-95"
          />
        </div>

        {/* Content Container */}
        <div className="relative max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-12 z-10">
          {/* Breadcrumbs - Fixed clickable links */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 mb-6">
            <Link href="/" className="hover:text-[#F36C21] transition">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link href="/products" className="hover:text-[#F36C21] transition">
              Laryngoscope
            </Link>
            <span className="text-slate-400">/</span>
            <span className="text-[#F36C21] font-semibold">
              Reusable Laryngoscope
            </span>
          </nav>

          {/* Heading and Subtitle */}
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-[#F36C21] tracking-tight leading-tight">
              Reusable Laryngoscope
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-normal">
              Precision Instruments For Advanced ENT Procedures
            </p>
          </div>

          {/* 3 Feature Badges in a Horizontal Row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-8 mt-4">
            {/* Badge 1: Premium Quality */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F36C21]/10 flex items-center justify-center text-[#F36C21] shrink-0 border border-[#F36C21]/20">
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  Premium Quality
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Built To Last
                </p>
              </div>
            </div>

            {/* Badge 2: ISO 13485, FDA & MDR */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F36C21]/10 flex items-center justify-center text-[#F36C21] shrink-0 border border-[#F36C21]/20">
                <Globe2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  ISO 13485, FDA & MDR
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Global Reach
                </p>
              </div>
            </div>

            {/* Badge 3: OEM & Private Label */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F36C21]/10 flex items-center justify-center text-[#F36C21] shrink-0 border border-[#F36C21]/20">
                <ThumbsUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">
                  OEM & Private Label
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  Solutions Your Brand
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. MAIN CATALOG BODY (Filters Sidebar + Products Grid)    */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-10 sm:py-14">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-sm font-semibold text-slate-800 shadow-sm"
            >
              <Filter className="w-4 h-4 text-[#F36C21]" />
              Filter Products
            </button>
            <span className="text-xs text-slate-500 font-medium">
              Showing Products {filteredProducts.length}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8 xl:gap-10">
            {/* ───────────── LEFT SIDEBAR ───────────── */}
            <aside
              className={`fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:w-[310px] xl:w-[330px] lg:p-0 lg:shadow-none lg:translate-x-0 ${
                mobileFilterOpen ? 'translate-x-0 overflow-y-auto' : '-translate-x-full lg:translate-x-0'
              }`}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {/* Filters Container Box */}
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-6">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Filters
                  </h3>
                  {(selectedCategory !== 'all' || selectedType !== 'all' || selectedMaterial !== 'all') && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setSelectedType('all')
                        setSelectedMaterial('all')
                      }}
                      className="text-xs text-[#F36C21] font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Group 1: Product Category (Single-select radio behavior) */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">
                    Product Category
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { key: 'all', label: 'All Categories' },
                      { key: 'single-use', label: 'Single Use Laryngoscopes' },
                      { key: 'reusable', label: 'Reusable Laryngoscopes' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        onClick={() => setSelectedCategory(item.key)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                            selectedCategory === item.key
                              ? 'bg-[#F36C21] border-[#F36C21] text-white'
                              : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                          }`}
                        >
                          {selectedCategory === item.key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Group 2: Product Type (Single-select radio behavior) */}
                <div className="space-y-3 pt-2 border-t border-slate-200/70">
                  <h4 className="text-sm font-bold text-slate-900">
                    Product Type
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { key: 'all', label: 'All Types' },
                      { key: 'macintosh', label: 'Macintosh Blades' },
                      { key: 'miller', label: 'Miller Blades' },
                      { key: 'conventional', label: 'Conventional Single Use' },
                      { key: 'plastic-fiber', label: 'Plastic / Fiber Optic' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        onClick={() => setSelectedType(item.key)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                            selectedType === item.key
                              ? 'bg-[#F36C21] border-[#F36C21] text-white'
                              : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                          }`}
                        >
                          {selectedType === item.key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Group 3: Material (Single-select radio behavior) */}
                <div className="space-y-3 pt-2 border-t border-slate-200/70">
                  <h4 className="text-sm font-bold text-slate-900">
                    Material
                  </h4>
                  <div className="space-y-2.5">
                    {[
                      { key: 'all', label: 'All Materials' },
                      { key: 'stainless-steel', label: 'Stainless Steel' },
                      { key: 'fiber-optic', label: 'Fiber Optic' },
                      { key: 'plastic', label: 'Plastic' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        onClick={() => setSelectedMaterial(item.key)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                            selectedMaterial === item.key
                              ? 'bg-[#F36C21] border-[#F36C21] text-white'
                              : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                          }`}
                        >
                          {selectedMaterial === item.key && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trusted Worldwide Dark Card */}
              <div className="relative mt-6 rounded-2xl bg-[#091535] text-white p-6 overflow-hidden border border-[#1A274E]">
                {/* World map background watermark */}
                <div
                  className="absolute inset-0 opacity-15 bg-center bg-no-repeat bg-contain pointer-events-none"
                  style={{
                    backgroundImage: `radial-gradient(circle at center, rgba(30,58,138,0.4) 0%, transparent 70%)`,
                  }}
                />

                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                    <Shield className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">
                      Trusted Worldwide
                    </h4>
                    <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                      Premium quality instruments for better patient care.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs font-medium text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>ISO Certified Quality</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Sterilized & Safe</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Durable Performance</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Global Trust</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Mobile filter backdrop */}
            {mobileFilterOpen && (
              <div
                onClick={() => setMobileFilterOpen(false)}
                className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
              />
            )}

            {/* ───────────── RIGHT PRODUCTS CONTENT ───────────── */}
            <main className="flex-1 w-full">
              {/* Controls & Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                    {selectedCategory === 'all'
                      ? 'All Surgical Instruments'
                      : selectedCategory === 'single-use'
                      ? 'Single Use Laryngoscopes'
                      : 'Reusable Laryngoscopes'}
                  </h2>
                  <div className="h-1 w-16 bg-[#F36C21] rounded-full mt-1.5" />
                  <p className="text-sm text-slate-500 font-normal mt-1">
                    Precision Instruments For Surgical Excellence
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-auto">
                  <span className="text-sm text-slate-600 font-medium hidden sm:inline">
                    Showing Products {filteredProducts.length}
                  </span>

                  {/* Toggle Grid / List Buttons */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        viewMode === 'list'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ListIcon className="w-3.5 h-3.5" />
                      List
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        viewMode === 'grid'
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Grid className="w-3.5 h-3.5" />
                      Grid
                    </button>
                  </div>
                </div>
              </div>

              {/* Product Grid / List Rendering */}
              {loading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#F36C21] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-slate-500 font-medium">Loading instruments catalog...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-[#F8FAFC] border border-dashed border-slate-300 rounded-2xl p-12 text-center space-y-3">
                  <p className="text-base font-semibold text-slate-700">No products match your current filter.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory('reusable')
                      setSelectedType('macintosh')
                      setSelectedMaterial('stainless-steel')
                    }}
                    className="px-4 py-2 bg-[#F36C21] text-white text-xs font-bold rounded-xl shadow hover:bg-[#E05B13] transition"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group flex flex-col bg-white rounded-2xl transition hover:shadow-lg duration-300"
                    >
                      {/* Product Card Image Container (Cool gray background #EEF2F6 matching design) */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="relative w-full aspect-[4/3] bg-[#EEF2F6] rounded-2xl overflow-hidden flex items-center justify-center p-6 border border-slate-200/60 cursor-pointer"
                      >
                        <Image
                          src={prod.featured_image || '/images/products/integrated-macintosh-fiber-optic-blade.png'}
                          alt={prod.title}
                          fill
                          unoptimized
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Hover Quick RFQ Button */}
                        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setInquiryProduct(prod)
                              setIsInquiryOpen(true)
                            }}
                            className="px-4 py-2 bg-[#F36C21] hover:bg-[#E05B13] text-white text-xs font-bold rounded-xl shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200"
                          >
                            Quick RFQ
                          </button>
                        </div>
                      </Link>

                      {/* Product Meta */}
                      <div className="pt-4 pb-2 px-1 space-y-1">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="block text-sm sm:text-base font-bold text-[#F36C21] hover:text-[#D95510] uppercase tracking-wide leading-snug transition-colors line-clamp-2"
                        >
                          {prod.title}
                        </Link>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          {prod.sku || 'TI-RL-100'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-4">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition"
                    >
                      <Link
                        href={`/products/${prod.slug}`}
                        className="relative w-full sm:w-48 aspect-[4/3] bg-[#EEF2F6] rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-3 cursor-pointer"
                      >
                        <Image
                          src={prod.featured_image || '/images/products/integrated-macintosh-fiber-optic-blade.png'}
                          alt={prod.title}
                          fill
                          unoptimized
                          className="object-contain p-2"
                        />
                      </Link>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          {prod.category_name || 'Reusable Laryngoscopes'}
                        </span>
                        <Link
                          href={`/products/${prod.slug}`}
                          className="block text-base sm:text-lg font-bold text-[#F36C21] hover:text-[#D95510] uppercase transition"
                        >
                          {prod.title}
                        </Link>
                        <p className="text-xs font-semibold text-slate-500">
                          SKU: {prod.sku || 'TI-RL-100'}
                        </p>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {prod.short_description || prod.full_description}
                        </p>
                      </div>

                      <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                        <button
                          onClick={() => {
                            setInquiryProduct(prod)
                            setIsInquiryOpen(true)
                          }}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#F36C21] hover:bg-[#E05B13] text-white text-xs font-bold rounded-xl shadow transition"
                        >
                          Quick RFQ
                        </button>
                        <button
                          onClick={() => {
                            addToQuoteCart(prod, 1)
                          }}
                          className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow transition"
                        >
                          Add to Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Inquiry RFQ Modal */}
      {isInquiryOpen && (
        <InquiryModal
          isOpen={isInquiryOpen}
          onClose={() => setIsInquiryOpen(false)}
          product={inquiryProduct}
        />
      )}
    </PublicShell>
  )
}
