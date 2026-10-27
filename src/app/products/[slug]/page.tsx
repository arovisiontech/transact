'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  Award,
  Globe2,
  ThumbsUp,
  Shield,
  Lightbulb,
  Crosshair,
  FileText,
  CheckCircle2,
  Box,
  Layers,
  ChevronRight,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react'
import { getStoredProducts, addToQuoteCart } from '@/src/lib/dataStore'
import initialProducts from '@/src/data/products.json'
import { ProductItem } from '@/src/types'
import InquiryModal from '@/src/components/public/InquiryModal'

// Rich formatted specifications renderer (supports **bold**, *italic*, bullets, next line)
function FormattedSpecifications({ text }: { text: string }) {
  const lines = text.split('\n').filter((l) => l.trim().length > 0)
  return (
    <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
      {lines.map((line, idx) => {
        const clean = line.trim().replace(/^[•\-\*]\s*/, '')
        // Match **bold** and *italic*
        const tokens = clean.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
        return (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="text-[#F36C21] font-bold text-base leading-none select-none mt-0.5">•</span>
            <span>
              {tokens.map((tok, tIdx) => {
                if (tok.startsWith('**') && tok.endsWith('**')) {
                  return (
                    <strong key={tIdx} className="font-bold text-slate-900">
                      {tok.slice(2, -2)}
                    </strong>
                  )
                }
                if (tok.startsWith('*') && tok.endsWith('*')) {
                  return (
                    <em key={tIdx} className="italic text-slate-800">
                      {tok.slice(1, -1)}
                    </em>
                  )
                }
                return tok
              })}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function ProductDetailContent() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const [product, setProduct] = useState<ProductItem>(initialProducts[0] as unknown as ProductItem)
  const [allProducts, setAllProducts] = useState<ProductItem[]>(initialProducts as unknown as ProductItem[])
  const [selectedImage, setSelectedImage] = useState<string>('/images/products/integrated-macintosh-fiber-optic-blade.png')
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false)
  const [inquiryProduct, setInquiryProduct] = useState<ProductItem | null>(null)

  // Sizing chart state with quantities
  const defaultChartRows = [
    { reference: 'TI-RL-100-0', blade: 'Neonate', size: 'Mac-0', weight: '85', length: 'L90 X H36' },
    { reference: 'TI-RL-100-1', blade: 'Infant', size: 'Mac-1', weight: '89', length: 'L96 X H36' },
    { reference: 'TI-RL-100-2', blade: 'Child', size: 'Mac-2', weight: '98', length: 'L111 X H36' },
    { reference: 'TI-RL-100-3', blade: 'Medium', size: 'Mac-3', weight: '119', length: 'L135 X H38' },
    { reference: 'TI-RL-100-4', blade: 'Large Adult', size: 'Mac-4', weight: '138', length: 'L157 X H39' },
    { reference: 'TI-RL-100-5', blade: 'X-Large', size: 'Mac-5', weight: '150', length: 'L176 X H40' },
  ]

  const [quantities, setQuantities] = useState<{ [key: string]: number }>({
    'TI-RL-100-0': 1,
    'TI-RL-100-1': 1,
    'TI-RL-100-2': 1,
    'TI-RL-100-3': 1,
    'TI-RL-100-4': 1,
    'TI-RL-100-5': 1,
  })

  // Load products live from server API & dataStore
  useEffect(() => {
    const loadProd = async () => {
      let prods = getStoredProducts().filter((p) => p.is_published)
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (res.ok) {
          const live: ProductItem[] = await res.json()
          if (Array.isArray(live) && live.length > 0) {
            prods = live.filter((p) => p.is_published)
          }
        }
      } catch (err) {
        console.warn('Product detail live fetch:', err)
      }

      setAllProducts(prods)
      const found = prods.find((p) => p.slug === slug || p.id === slug) || prods[0] || (initialProducts[0] as unknown as ProductItem)
      setProduct(found)
      setSelectedImage(found.featured_image || '/images/products/integrated-macintosh-fiber-optic-blade.png')

      // Initialize row quantities
      const initialQty: { [key: string]: number } = {}
      const rows = found.chart_rows || defaultChartRows
      rows.forEach((r) => {
        initialQty[r.reference] = 1
      })
      setQuantities(initialQty)
    }

    loadProd()
  }, [slug])

  const chartRows = product.chart_rows || defaultChartRows

  const handleQtyChange = (ref: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[ref] || 1
      const next = Math.max(0, current + delta)
      return { ...prev, [ref]: next }
    })
  }

  // Add all selected chart sizes to inquiry quote cart
  const handleAddChartToInquiry = () => {
    let totalAdded = 0
    chartRows.forEach((row) => {
      const count = quantities[row.reference] || 0
      if (count > 0) {
        addToQuoteCart(
          {
            ...product,
            id: `${product.id}-${row.reference}`,
            title: `${product.title} (${row.size} - ${row.blade})`,
            sku: row.reference,
          },
          count
        )
        totalAdded += count
      }
    })

    setInquiryProduct(product)
    setInquiryModalOpen(true)
  }

  const galleryList = [
    product.featured_image || '/images/products/integrated-macintosh-fiber-optic-blade.png',
    '/images/products/laryngoscope-attachment-1.png',
    '/images/products/laryngoscope-attachment-2.png',
  ]

  return (
    <PublicShell>
      {/* ─────────────────────────────────────────────────────────── */}
      {/* 1. HERO SECTION (Matching Transact INTL Large Page.svg)   */}
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
          {/* Breadcrumbs - Working navigation */}
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
      {/* 2. PRODUCT DETAILS & SPECIFICATIONS (Matching SS 3)        */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Title, SKU, Rich Specifications & 3 Badges */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#F36C21] uppercase tracking-wide leading-tight">
                  {product.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wider">
                  {product.sku || 'TI-RL-100'}
                </p>
              </div>

              {/* SPECIFICATION Header */}
              <div className="pt-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 uppercase tracking-wider mb-3">
                  SPECIFICATION
                </h3>

                {/* Formatted Specification Bullets (supports bold, italic, bullets, next line) */}
                <FormattedSpecifications
                  text={
                    product.specifications_markdown ||
                    product.full_description ||
                    `• Completely Sealed One Piece **BLADE CONSTRUCTION** Maintenance Free Design\n• Smooth Shape No Sharp Edges Or Cavities, Very Easy to Clean And Disinfect\n• Distal Lip Of All Integrated FIO Blades Features Special *Non-Traumatic Profile*\n• Shortened Shoulder Of Blades Improve The Anesthetist's View To **Epiglottis & Vocal Cords**\n• Fiber Optic Bundle Of **5.0mm & 8000 Individual Micro Fibers** For Best-In-Class Light Transmission\n• All Blades Made Of Premium Grade Stainless Steel In Matt Finish\n• Both Ends Of Large Fiber Bundle Are Protected - For Long Life Of Blades\n• Crafted From Finest Stainless Steel **AISI 303 / 304**\n• Blades Are Also Compatible With Other Low-Temperature Gas Plasma Sterilization Procedures\n• No Flickering Or Low Light Issue - Due To Lamp Located Inside Protected Handless Harness\n• Autoclavable **134°C / 5 Minutes**, For **4500 - 5000 Cycles** At Maximum Light Output`
                  }
                />
              </div>

              {/* 3 Badges in Orange Container Box */}
              <div className="mt-8 rounded-2xl bg-[#F36C21] p-4 sm:p-5 text-white shadow-lg grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Fiber Optic LED</p>
                    <p className="text-[11px] text-white/80">Brilliant Illumination</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Durable Construction</p>
                    <p className="text-[11px] text-white/80">Stainless Steel</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Crosshair className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Precision Design</p>
                    <p className="text-[11px] text-white/80">Better Patient Care</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Large Product Image in Cool Gray Container */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div 
                className="relative w-full aspect-[4/3] bg-[#EEF2F6] rounded-none rounded-bl-[10px] overflow-hidden flex items-center justify-center p-8 border border-slate-200 shadow-sm"
                style={{ borderRadius: '0px 0px 0px 10px' }}
              >
                <Image
                  src={selectedImage}
                  alt={product.title}
                  fill
                  priority
                  unoptimized
                  className="object-contain p-6 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 3. FUNCTIONAL SIZING SPECIFICATION CHART & THUMBNAILS       */}
      {/* ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pb-16">
        <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Functional Sizing Table */}
            <div className="lg:col-span-8 space-y-5">
              <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  {/* Table Header */}
                  <thead className="bg-[#2B4964] text-white font-bold">
                    <tr>
                      <th className="py-3 px-4">Reference</th>
                      <th className="py-3 px-4">Blade</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Weight (g)</th>
                      <th className="py-3 px-4">Overall Length</th>
                      <th className="py-3 px-4 text-center">Quantity</th>
                    </tr>
                  </thead>

                  {/* Table Rows */}
                  <tbody className="divide-y divide-slate-200">
                    {chartRows.map((row, idx) => {
                      const qty = quantities[row.reference] || 1
                      return (
                        <tr
                          key={row.reference}
                          className={idx % 2 === 0 ? 'bg-white hover:bg-slate-50/80 transition' : 'bg-[#F8FAFC] hover:bg-slate-100 transition'}
                        >
                          <td className="py-3 px-4 font-bold text-slate-900">{row.reference}</td>
                          <td className="py-3 px-4 text-slate-700">{row.blade}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">{row.size}</td>
                          <td className="py-3 px-4 text-slate-700">{row.weight}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{row.length}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1 w-28 mx-auto shadow-xs">
                              <button
                                onClick={() => handleQtyChange(row.reference, -1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 transition font-bold"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-bold text-slate-900 text-xs sm:text-sm">
                                {qty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(row.reference, 1)}
                                className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900 transition font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add To Inquiry Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleAddChartToInquiry}
                  className="px-8 py-3 bg-[#F36C21] hover:bg-[#E05B13] text-white text-sm font-bold rounded-xl shadow-md transition transform hover:-translate-y-0.5"
                >
                  Add To Inquiry
                </button>
              </div>
            </div>

            {/* Right 4 Cols: 3 Thumbnail Gallery Cards */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedImage(galleryList[0])}
                className={`relative aspect-[4/3] rounded-none rounded-bl-[10px] overflow-hidden bg-[#EEF2F6] border-2 transition p-4 flex items-center justify-center ${
                  selectedImage === galleryList[0] ? 'border-[#F36C21] shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ borderRadius: '0px 0px 0px 10px' }}
              >
                <Image
                  src={galleryList[0]}
                  alt="Blade View 1"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </button>

              <button
                onClick={() => setSelectedImage(galleryList[1])}
                className={`relative aspect-[4/3] rounded-none rounded-bl-[10px] overflow-hidden bg-[#EEF2F6] border-2 transition p-4 flex items-center justify-center ${
                  selectedImage === galleryList[1] ? 'border-[#F36C21] shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ borderRadius: '0px 0px 0px 10px' }}
              >
                <Image
                  src={galleryList[1]}
                  alt="Blade Attachment 1"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </button>

              <button
                onClick={() => setSelectedImage(galleryList[2])}
                className={`relative col-span-2 aspect-[16/9] rounded-none rounded-bl-[10px] overflow-hidden bg-[#EEF2F6] border-2 transition p-4 flex items-center justify-center ${
                  selectedImage === galleryList[2] ? 'border-[#F36C21] shadow-md' : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ borderRadius: '0px 0px 0px 10px' }}
              >
                <Image
                  src={galleryList[2]}
                  alt="Blade Attachment 2"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 4. SECTION: BUILT TO PERFORM. MADE TO LAST. (Dynamic Editable) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {(() => {
        const builtData = product.built_to_perform || {
          heading: 'BUILT TO PERFORM. MADE TO LAST.',
          cards: [
            {
              title: 'Product Catalogs',
              description: 'Explore Our Comprehensive Range Of Surgical Instruments Designed For Precision And Professional Use.',
              link_text: 'View Catalogs',
              link_url: '/catalogues',
            },
            {
              title: 'Quality Standards',
              description: 'Manufactured to DIN and ISO/ASTM Standards with strict quality control to ensure reliability and safety.',
              link_text: 'View Standards',
              link_url: '/about#quality',
            },
            {
              title: 'OEM / Private Label',
              description: 'Custom Manufacturing, Private Label Branding And Sterile Kitting Solutions Tailored To Your Business Needs.',
              link_text: 'View OEM Solutions',
              link_url: '/production',
            },
            {
              title: 'Materials & Sterilization',
              description: 'Premium German & Japanese Stainless Steel With Options For Reusable, Single-Use And EO Sterilized Configurations.',
              link_text: 'View Materials',
              link_url: '/about',
            },
          ],
        }

        const icons = [FileText, CheckCircle2, Box, Layers]

        return (
          <section className="bg-[#F4F6F9] py-16 sm:py-20 border-t border-slate-200">
            <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0A1328] text-center uppercase tracking-wide mb-12">
                {builtData.heading || 'BUILT TO PERFORM. MADE TO LAST.'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(builtData.cards || []).map((card, cIdx) => {
                  const IconComponent = icons[cIdx % icons.length]
                  return (
                    <div
                      key={cIdx}
                      className="bg-white rounded-2xl p-7 shadow-sm border border-slate-100 flex flex-col justify-between space-y-4 hover:shadow-md transition"
                    >
                      <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FFF4EB] flex items-center justify-center text-[#F36C21] border border-[#F36C21]/20">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {card.title}
                          </h3>
                          <div className="h-0.5 w-10 bg-[#F36C21] mt-1 mb-3" />
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {card.description}
                          </p>
                        </div>
                      </div>
                      <Link
                        href={card.link_url || '#'}
                        className="text-xs font-bold text-[#F36C21] hover:underline inline-flex items-center gap-1 pt-2"
                      >
                        {card.link_text || 'View Details'} <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* 5. RELATED PRODUCTS SECTION (Dynamic & Configurable)        */}
      {/* ─────────────────────────────────────────────────────────── */}
      {(() => {
        const relatedDisplay =
          product.custom_related_products && product.custom_related_products.length > 0
            ? product.custom_related_products
            : allProducts.filter((p) => p.id !== product.id).length > 0
            ? allProducts.filter((p) => p.id !== product.id).slice(0, 4)
            : allProducts.slice(0, 4)

        return (
          <section className="bg-white py-16 sm:py-20">
            <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16">
              <div className="mb-10">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
                  RELATED <span className="text-[#F36C21]">PRODUCTS</span>
                </h2>
                <div className="h-1 w-16 bg-[#F36C21] rounded-full mt-1.5" />
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Explore Our Range
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {relatedDisplay.map((relProd, idx) => {
                  const href = relProd.slug ? `/products/${relProd.slug}` : `/products/${product.slug}`
                  const imageSrc =
                    (relProd as any).image ||
                    (relProd as any).featured_image ||
                    '/images/products/integrated-macintosh-fiber-optic-blade.png'

                  return (
                    <div 
                      key={idx} 
                      className="group flex flex-col bg-white rounded-none rounded-bl-[10px] transition hover:shadow-lg"
                      style={{ borderRadius: '0px 0px 0px 10px' }}
                    >
                      <Link
                        href={href}
                        className="relative w-full aspect-[4/3] bg-[#EEF2F6] rounded-none rounded-bl-[10px] overflow-hidden flex items-center justify-center p-6 border border-slate-200/60"
                        style={{ borderRadius: '0px 0px 0px 10px' }}
                      >
                        <Image
                          src={imageSrc}
                          alt={relProd.title}
                          fill
                          unoptimized
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      <div className="pt-4 pb-2 px-1 space-y-1">
                        <Link
                          href={href}
                          className="block text-sm font-bold text-[#F36C21] hover:text-[#D95510] uppercase tracking-wide leading-snug transition-colors line-clamp-2"
                        >
                          {relProd.title}
                        </Link>
                        <p className="text-xs text-slate-500 font-medium">
                          {relProd.sku || 'TI-RL-100'}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })()}

      {/* Inquiry Quote Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          isOpen={inquiryModalOpen}
          onClose={() => setInquiryModalOpen(false)}
          product={inquiryProduct || product}
        />
      )}
    </PublicShell>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-[#F36C21] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductDetailContent />
    </Suspense>
  )
}
