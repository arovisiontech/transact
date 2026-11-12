'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  Layers,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCategories,
  getStoredSubcategories,
  getStoredFilterFacets,
  addToQuoteCart,
  FilterFacets,
} from '@/src/lib/dataStore'
import initialProducts from '@/src/data/products.json'
import initialCategories from '@/src/data/categories.json'
import initialSubcategories from '@/src/data/subcategories.json'
import { ProductItem, CategoryItem, SubcategoryItem } from '@/src/types'
import InquiryModal from '@/src/components/public/InquiryModal'

function cleanProductTitle(title: string | undefined): string {
  if (!title) return ''
  const trimmed = title.trim()
  const len = trimmed.length
  if (len > 10) {
    const half = Math.floor(len / 2)
    const firstHalf = trimmed.slice(0, half).trim()
    const secondHalf = trimmed.slice(half).trim()
    if (firstHalf.toLowerCase() === secondHalf.toLowerCase()) {
      return firstHalf
    }
  }
  return trimmed
}

function ProductCardImage({
  src,
  alt,
  className = 'object-contain p-1 group-hover:scale-105 transition-transform duration-300',
}: {
  src: string | null | undefined
  alt: string
  className?: string
}) {
  const fallback = '/images/products/integrated-macintosh-fiber-optic-blade.png'
  const getCleanSrc = (url?: string | null) => {
    if (!url || url.startsWith('blob:') || url.includes('Rectangle 819 (1)') || url.includes('Rectangle-819-1')) {
      return fallback
    }
    if (url.includes('image 352') || url.includes('image-352')) {
      return '/images/products/disposable-sterile-blade.jpg'
    }
    return url
  }

  const [imgUrl, setImgUrl] = useState(() => getCleanSrc(src))
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    setImgUrl(getCleanSrc(src))
    setHasError(false)
  }, [src])

  return (
    <Image
      src={hasError ? fallback : imgUrl}
      alt={alt}
      fill
      unoptimized
      onError={() => {
        if (!hasError) {
          setHasError(true)
          setImgUrl(fallback)
        }
      }}
      className={className}
    />
  )
}

function ProductsCatalogContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') || searchParams.get('cat')
  const subcategoryParam = searchParams.get('subcategory') || searchParams.get('subcat')

  const [products, setProducts] = useState<ProductItem[]>(initialProducts as unknown as ProductItem[])
  const [categoriesList, setCategoriesList] = useState<CategoryItem[]>(initialCategories as unknown as CategoryItem[])
  const [subcategoriesList, setSubcategoriesList] = useState<SubcategoryItem[]>(
    initialSubcategories as unknown as SubcategoryItem[]
  )
  const [filterFacets, setFilterFacets] = useState<FilterFacets>({
    productTypes: [
      'Macintosh Blades',
      'Miller Blades',
      'Conventional Single Use',
      'Plastic / Fiber Optic',
    ],
    materials: ['Stainless Steel', 'Fiber Optic'],
  })

  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [inquiryProduct, setInquiryProduct] = useState<ProductItem | null>(null)
  const [isInquiryOpen, setIsInquiryOpen] = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Single Selection Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')

  // Initialize from URL params if present
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
    }
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam)
    }
  }, [categoryParam, subcategoryParam])

  // Load live data from dataStore / server APIs
  const reloadData = async () => {
    try {
      const storedCats = getStoredCategories().filter((c) => c.is_published !== false)
      if (storedCats.length > 0) setCategoriesList(storedCats)

      const storedSubs = getStoredSubcategories().filter((s) => s.is_active !== false)
      if (storedSubs.length > 0) setSubcategoriesList(storedSubs)

      const storedFacets = getStoredFilterFacets()
      if (storedFacets) setFilterFacets(storedFacets)
    } catch (e) {
      console.warn('Error reading stored categories/facets:', e)
    }

    const deletedProdIds = new Set(
      typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('transact_deleted_products_v3') || '[]')
        : []
    )

    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) {
        const liveProds: ProductItem[] = await res.json()
        if (Array.isArray(liveProds)) {
          const filteredLive = liveProds.filter((p) => !deletedProdIds.has(p.id) && p.is_published !== false)
          const localProds = getStoredProducts().filter((p) => !deletedProdIds.has(p.id) && p.is_published !== false)
          const map = new Map<string, ProductItem>()
          filteredLive.forEach((p) => map.set(p.id, p))
          localProds.forEach((p) => map.set(p.id, p))
          const unified = Array.from(map.values())
          if (unified.length > 0) {
            setProducts(unified)
            setLoading(false)
            return
          }
        }
      }
    } catch (err) {
      console.warn('Live fetch error, falling back to dataStore:', err)
    }

    const localProds = getStoredProducts().filter((p) => !deletedProdIds.has(p.id) && p.is_published !== false)
    if (localProds.length > 0) {
      setProducts(localProds)
    }
    setLoading(false)
  }

  useEffect(() => {
    reloadData()
    const handleDataUpdate = () => reloadData()
    window.addEventListener('transact_data_updated', handleDataUpdate)
    return () => window.removeEventListener('transact_data_updated', handleDataUpdate)
  }, [])

  // Active Category metadata for Hero header & subcategory filters
  const activeCategory = categoriesList.find(
    (c) =>
      c.slug === selectedCategory ||
      c.id === selectedCategory ||
      (selectedCategory === 'single-use' && c.slug?.includes('single')) ||
      (selectedCategory === 'reusable' && c.slug?.includes('reusable')) ||
      (selectedCategory === 'diagnostics' && c.slug?.includes('diagnos'))
  )

  // Subcategories relevant to currently selected category (or all if 'all')
  const availableSubcategories = subcategoriesList.filter((s) => {
    if (!activeCategory || selectedCategory === 'all') return true
    return s.category_id === activeCategory.id || s.category_name === activeCategory.name
  })

  // Filtered Products according to active filters
  const filteredProducts = products.filter((prod) => {
    // 1. Category Filter
    if (selectedCategory && selectedCategory !== 'all') {
      const catKey = selectedCategory.toLowerCase()
      const prodCatId = (prod.category_id || '').toLowerCase()
      const prodCatName = (prod.category_name || '').toLowerCase()

      let catMatches = false
      if (activeCategory) {
        if (prodCatId === activeCategory.id.toLowerCase() || prodCatName === activeCategory.name.toLowerCase()) {
          catMatches = true
        }
      }
      if (
        prodCatId === catKey ||
        prodCatName.includes(catKey) ||
        (catKey.includes('single') && prodCatName.includes('single')) ||
        (catKey.includes('reusable') && prodCatName.includes('reusable')) ||
        (catKey.includes('diagnost') && prodCatName.includes('diagnost')) ||
        (catKey.includes('pocket') && prodCatName.includes('pocket')) ||
        (catKey.includes('otoscop') && prodCatName.includes('otoscop'))
      ) {
        catMatches = true
      }
      if (!catMatches) return false
    }

    // 2. Subcategory Filter
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      const subKey = selectedSubcategory.toLowerCase()
      const prodSubId = (prod.subcategory_id || '').toLowerCase()
      const prodSubName = (prod.subcategory_name || '').toLowerCase()

      const isSubMatch =
        prodSubId === subKey ||
        prodSubName.includes(subKey) ||
        (prod.title || '').toLowerCase().includes(subKey)

      if (!isSubMatch) return false
    }

    // 3. Type Filter
    if (selectedType && selectedType !== 'all') {
      const pType = (prod.product_type || '').toLowerCase()
      const selType = selectedType.toLowerCase()
      if (selType === 'macintosh' && !pType.includes('macintosh')) return false
      if (selType === 'miller' && !pType.includes('miller')) return false
      if (selType === 'conventional' && !pType.includes('conventional')) return false
      if (selType === 'plastic-fiber' && !pType.includes('plastic') && !pType.includes('fiber')) return false
      if (!pType.includes(selType) && !selType.includes(pType)) return false
    }

    // 4. Material Filter
    if (selectedMaterial && selectedMaterial !== 'all') {
      const mat = (prod.material || '').toLowerCase()
      const selMat = selectedMaterial.toLowerCase()
      if (selMat === 'stainless-steel' && !mat.includes('stainless') && !mat.includes('steel')) return false
      if (selMat === 'fiber-optic' && !mat.includes('fiber')) return false
      if (selMat === 'plastic' && !mat.includes('plastic')) return false
      if (!mat.includes(selMat) && !selMat.includes(mat)) return false
    }

    return true
  })

  // Dynamic Header Titles
  const heroHeading = activeCategory ? activeCategory.name : 'Complete Product Line'
  const heroSubtitle = activeCategory?.description
    ? activeCategory.description
    : 'Hospital-grade German stainless steel and sterile diagnostic solutions engineered for patient safety.'

  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (Dynamic to Selected Category)            */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="relative w-full bg-[#EBF3F8] overflow-hidden border-b border-[#D8E6F0] min-h-[340px]">
        {/* Full Hero Background Banner */}
        <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden">
          <Image
            src={activeCategory?.card_image || '/image 431.svg'}
            alt={heroHeading}
            fill
            priority
            unoptimized
            className="object-cover object-center transition-opacity duration-500"
          />
          {/* Subtle overlay so text remains 100% crisp and readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#EBF3F8]/95 via-[#EBF3F8]/85 to-[#EBF3F8]/40 sm:to-transparent" />
        </div>

        {/* Content Container */}
        <div className="relative max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 pt-10 pb-12 z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 mb-6 flex-wrap">
            <Link href="/" className="hover:text-[#F36C21] transition">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedSubcategory('all')
              }}
              className="hover:text-[#F36C21] transition text-slate-600"
            >
              Catalog
            </button>
            {activeCategory && (
              <>
                <span className="text-slate-400">/</span>
                <span className="text-[#F36C21] font-semibold">{activeCategory.name}</span>
              </>
            )}
          </nav>

          {/* Heading and Subtitle */}
          <div className="max-w-2xl space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-black text-[#F36C21] tracking-tight leading-tight">
              {heroHeading}
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed">
              {heroSubtitle}
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
                <p className="text-sm font-bold text-slate-900 leading-tight">Premium Quality</p>
                <p className="text-xs text-slate-500 font-medium">Built To Last</p>
              </div>
            </div>

            {/* Badge 2: ISO 13485, FDA & MDR */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F36C21]/10 flex items-center justify-center text-[#F36C21] shrink-0 border border-[#F36C21]/20">
                <Globe2 className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">ISO 13485, FDA & MDR</p>
                <p className="text-xs text-slate-500 font-medium">Global Reach</p>
              </div>
            </div>

            {/* Badge 3: OEM & Private Label */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#F36C21]/10 flex items-center justify-center text-[#F36C21] shrink-0 border border-[#F36C21]/20">
                <ThumbsUp className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 leading-tight">OEM & Private Label</p>
                <p className="text-xs text-slate-500 font-medium">Solutions Your Brand</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 2. SUBCATEGORY PILL NAVIGATION BAR                        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {availableSubcategories.length > 0 && (
        <div className="bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#F36C21]" /> Subcategories:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                selectedSubcategory === 'all'
                  ? 'bg-[#081022] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
              }`}
            >
              All Subcategories
            </button>
            {availableSubcategories.map((sub) => {
              const isSelected =
                selectedSubcategory === sub.id ||
                selectedSubcategory === sub.slug ||
                selectedSubcategory.toLowerCase() === sub.name.toLowerCase()
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                    isSelected
                      ? 'bg-[#F36C21] text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-[#F36C21] hover:text-[#F36C21]'
                  }`}
                >
                  {sub.name}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. MAIN CATALOG BODY (Filters Sidebar + Products Grid)       */}
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
            {/* ───────────── LEFT SIDEBAR (CATALOG FILTERS) ───────────── */}
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
                  <h3 className="font-bold text-slate-900 text-lg">Filters</h3>
                  {(selectedCategory !== 'all' ||
                    selectedSubcategory !== 'all' ||
                    selectedType !== 'all' ||
                    selectedMaterial !== 'all') && (
                    <button
                      onClick={() => {
                        setSelectedCategory('all')
                        setSelectedSubcategory('all')
                        setSelectedType('all')
                        setSelectedMaterial('all')
                      }}
                      className="text-xs text-[#F36C21] font-bold hover:underline"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Group 1: Product Category */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-900">Product Category</h4>
                  <div className="space-y-2.5">
                    {/* Dynamic Categories */}
                    {categoriesList.map((cat) => {
                      const isCatSelected =
                        selectedCategory === cat.slug ||
                        selectedCategory === cat.id ||
                        (selectedCategory === 'single-use' && cat.slug?.includes('single')) ||
                        (selectedCategory === 'reusable' && cat.slug?.includes('reusable'))

                      return (
                        <label
                          key={cat.id}
                          onClick={() => {
                            if (isCatSelected) {
                              setSelectedCategory('all')
                              setSelectedSubcategory('all')
                            } else {
                              setSelectedCategory(cat.slug || cat.id)
                              setSelectedSubcategory('all')
                            }
                          }}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div
                            className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                              isCatSelected
                                ? 'bg-[#F36C21] border-[#F36C21] text-white'
                                : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                            }`}
                          >
                            {isCatSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                            {cat.name}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Group 2: Product Type */}
                <div className="space-y-3 pt-2 border-t border-slate-200/70">
                  <h4 className="text-sm font-bold text-slate-900">Product Type</h4>
                  <div className="space-y-2.5">
                    <label
                      onClick={() => setSelectedType('all')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                          selectedType === 'all'
                            ? 'bg-[#F36C21] border-[#F36C21] text-white'
                            : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                        }`}
                      >
                        {selectedType === 'all' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                        All Types
                      </span>
                    </label>

                    {filterFacets.productTypes.map((item) => (
                      <label
                        key={item}
                        onClick={() => setSelectedType(item)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                            selectedType === item
                              ? 'bg-[#F36C21] border-[#F36C21] text-white'
                              : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                          }`}
                        >
                          {selectedType === item && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Group 3: Material */}
                <div className="space-y-3 pt-2 border-t border-slate-200/70">
                  <h4 className="text-sm font-bold text-slate-900">Material</h4>
                  <div className="space-y-2.5">
                    <label
                      onClick={() => setSelectedMaterial('all')}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                          selectedMaterial === 'all'
                            ? 'bg-[#F36C21] border-[#F36C21] text-white'
                            : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                        }`}
                      >
                        {selectedMaterial === 'all' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                        All Materials
                      </span>
                    </label>

                    {filterFacets.materials.map((item) => (
                      <label
                        key={item}
                        onClick={() => setSelectedMaterial(item)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition border ${
                            selectedMaterial === item
                              ? 'bg-[#F36C21] border-[#F36C21] text-white'
                              : 'border-slate-300 bg-white group-hover:border-[#F36C21]'
                          }`}
                        >
                          {selectedMaterial === item && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium">
                          {item}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trusted Worldwide Dark Card */}
              <div className="relative mt-6 rounded-2xl bg-[#091535] text-white p-6 overflow-hidden border border-[#1A274E]">
                <div className="relative z-10 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-cyan-400">
                    <Shield className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white leading-tight">Trusted Worldwide</h4>
                    <p className="text-xs text-blue-100/70 mt-1 leading-relaxed">
                      Premium quality instruments for safe clinical intubation and diagnostics.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2 text-xs font-medium text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>ISO 13485 & CE Mark</span>
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
                      <span>Exported Worldwide</span>
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
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{heroHeading}</h2>
                  <div className="h-1 w-16 bg-[#F36C21] rounded-full mt-1.5" />
                  <p className="text-sm text-slate-500 font-normal mt-1">
                    Precision Instruments For Surgical & Diagnostic Excellence
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
                      setSelectedCategory('all')
                      setSelectedSubcategory('all')
                      setSelectedType('all')
                      setSelectedMaterial('all')
                    }}
                    className="px-4 py-2 bg-[#F36C21] text-white text-xs font-bold rounded-xl shadow hover:bg-[#E05B13] transition"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map((prod) => (
                    <div
                      key={prod.id}
                      className="group flex flex-col bg-white rounded-none rounded-bl-[24px] transition hover:shadow-xl duration-300"
                      style={{ borderRadius: '0px 0px 0px 24px' }}
                    >
                      {/* Product Card Image Container (Figma SS2 Style: Light grey-blue full surface) */}
                      <Link
                        href={`/products/${prod.slug}`}
                        className="relative w-full aspect-[4/3] bg-[#EDF1F6] rounded-none rounded-bl-[24px] overflow-hidden flex items-center justify-center p-2 sm:p-3 border border-slate-200/80 cursor-pointer group-hover:border-[#F36C21]/40 transition-colors shadow-sm"
                        style={{ borderRadius: '0px 0px 0px 24px' }}
                      >
                        <ProductCardImage
                          src={prod.featured_image}
                          alt={prod.title}
                          className="object-contain p-1 sm:p-1.5 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Product Meta */}
                      <div className="pt-4 pb-2 px-1 space-y-1">
                        <Link
                          href={`/products/${prod.slug}`}
                          className="block text-sm sm:text-base font-bold text-[#F36C21] hover:text-[#D95510] uppercase tracking-wide leading-snug transition-colors line-clamp-2"
                        >
                          {cleanProductTitle(prod.title)}
                        </Link>
                        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span>{prod.sku || 'TI-RL-100'}</span>
                          {prod.subcategory_name && (
                            <span className="text-[#F36C21] text-[11px] truncate max-w-[150px]">
                              {prod.subcategory_name}
                            </span>
                          )}
                        </div>
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
                      className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 bg-white border border-slate-200 rounded-none rounded-bl-[20px] hover:shadow-md transition"
                      style={{ borderRadius: '0px 0px 0px 20px' }}
                    >
                      <Link
                        href={`/products/${prod.slug}`}
                        className="relative w-full sm:w-48 aspect-[4/3] bg-[#EDF1F6] rounded-none rounded-bl-[20px] overflow-hidden shrink-0 flex items-center justify-center p-2 cursor-pointer border border-slate-200/80"
                        style={{ borderRadius: '0px 0px 0px 20px' }}
                      >
                        <ProductCardImage
                          src={prod.featured_image}
                          alt={prod.title}
                          className="object-contain p-1"
                        />
                      </Link>

                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            {prod.category_name || 'Reusable Laryngoscopes'}
                          </span>
                          {prod.subcategory_name && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="text-[11px] font-semibold text-[#F36C21]">
                                {prod.subcategory_name}
                              </span>
                            </>
                          )}
                        </div>

                        <Link
                          href={`/products/${prod.slug}`}
                          className="block text-base sm:text-lg font-bold text-[#F36C21] hover:text-[#D95510] uppercase transition"
                        >
                          {cleanProductTitle(prod.title)}
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <PublicShell>
          <div className="py-32 text-center">
            <div className="w-10 h-10 border-4 border-[#F36C21] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Loading catalog...</p>
          </div>
        </PublicShell>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  )
}
