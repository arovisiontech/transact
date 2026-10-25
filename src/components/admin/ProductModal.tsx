'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  Save,
  CheckCircle2,
  Package,
  Sparkles,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  FolderOpen,
  Plus,
  Layers,
  Check,
  ExternalLink,
  Table,
  Sliders,
  Link2,
} from 'lucide-react'
import { ProductItem, CategoryItem } from '@/src/types'
import { getStoredCategories, getStoredProducts, saveProduct, saveCategory } from '@/src/lib/dataStore'

interface ProductModalProps {
  product: ProductItem | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const defaultSizingRows = [
  { reference: 'TI-RL-100-0', blade: 'Neonate', size: 'Mac-0', weight: '85', length: 'L90 X H36' },
  { reference: 'TI-RL-100-1', blade: 'Infant', size: 'Mac-1', weight: '89', length: 'L96 X H36' },
  { reference: 'TI-RL-100-2', blade: 'Child', size: 'Mac-2', weight: '98', length: 'L111 X H36' },
  { reference: 'TI-RL-100-3', blade: 'Medium', size: 'Mac-3', weight: '119', length: 'L135 X H38' },
  { reference: 'TI-RL-100-4', blade: 'Large Adult', size: 'Mac-4', weight: '138', length: 'L157 X H39' },
  { reference: 'TI-RL-100-5', blade: 'X-Large', size: 'Mac-5', weight: '150', length: 'L176 X H40' },
]

const defaultBuiltToPerform = {
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

export default function ProductModal({ product, isOpen, onClose, onSaved }: ProductModalProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [availableProducts, setAvailableProducts] = useState<ProductItem[]>([])
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    title: '',
    slug: '',
    sku: '',
    category_id: '',
    category_name: '',
    product_type: 'Macintosh Blades',
    material: 'Stainless Steel',
    price: 125.0,
    stock_quantity: 100,
    badge: 'REUSABLE SURGICAL GRADE',
    short_description: '',
    full_description: '',
    specifications_markdown: '',
    featured_image: '/images/products/integrated-macintosh-fiber-optic-blade.png',
    chart_rows: defaultSizingRows,
    built_to_perform: defaultBuiltToPerform,
    custom_related_products: [],
    related_product_ids: [],
    is_featured: true,
    is_published: true,
    sort_order: 1,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [showNewCatInput, setShowNewCatInput] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newRelTitle, setNewRelTitle] = useState('')
  const [newRelSku, setNewRelSku] = useState('')
  const [newRelImage, setNewRelImage] = useState('/images/products/integrated-macintosh-fiber-optic-blade.png')
  const [isRelUploading, setIsRelUploading] = useState(false)
  const [isRelDragOver, setIsRelDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const relFileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const reloadCategories = async () => {
    try {
      const res = await fetch('/api/categories', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data)
          return data
        }
      }
    } catch {}
    const local = getStoredCategories()
    setCategories(local)
    return local
  }

  const reloadProducts = async () => {
    try {
      const res = await fetch('/api/products', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setAvailableProducts(data)
          return data
        }
      }
    } catch {}
    const local = getStoredProducts()
    setAvailableProducts(local)
    return local
  }

  useEffect(() => {
    reloadCategories()
    reloadProducts()
  }, [])

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        product_type: product.product_type || 'Macintosh Blades',
        material: product.material || 'Stainless Steel',
        chart_rows: product.chart_rows && product.chart_rows.length > 0 ? product.chart_rows : defaultSizingRows,
        built_to_perform: product.built_to_perform || defaultBuiltToPerform,
        custom_related_products: product.custom_related_products || [],
        related_product_ids: product.related_product_ids || [],
      })
    } else {
      const defCat = categories[0]
      setFormData({
        id: `prod-${Date.now()}`,
        title: '',
        slug: '',
        sku: `TI-RL-${Math.floor(100 + Math.random() * 900)}`,
        category_id: defCat?.id || 'cat-reusable-laryngoscopes',
        category_name: defCat?.name || 'Reusable Laryngoscopes',
        product_type: 'Macintosh Blades',
        material: 'Stainless Steel',
        price: 125.0,
        stock_quantity: 100,
        badge: 'REUSABLE SURGICAL GRADE',
        short_description: '',
        full_description: '',
        specifications_markdown:
          '• Completely Sealed One Piece BLADE CONSTRUCTION\n• Distal Lip Of All Integrated Blades\n• Crafted From Finest Stainless Steel AISI 303 / 304\n• Fiber Optic Core With High Transmission Rate\n• Fully Autoclavable And Sterilization Compatible',
        featured_image: '/images/products/integrated-macintosh-fiber-optic-blade.png',
        chart_rows: defaultSizingRows,
        built_to_perform: defaultBuiltToPerform,
        custom_related_products: [],
        related_product_ids: [],
        is_featured: true,
        is_published: true,
        sort_order: 1,
      })
    }
  }, [product, categories, isOpen])

  if (!isOpen) return null

  const handleTitleChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
    setFormData((prev) => ({ ...prev, title: val, slug: product ? prev.slug : slug }))
  }

  const handleCategoryChange = (catId: string) => {
    const cat = categories.find((c) => c.id === catId)
    setFormData((prev) => ({
      ...prev,
      category_id: catId,
      category_name: cat ? cat.name : prev.category_name,
    }))
  }

  const handleCreateNewCategory = async () => {
    if (!newCatName.trim()) return
    const slug = newCatName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')

    const newCat: CategoryItem = {
      id: `cat-${slug || Date.now()}`,
      name: newCatName.trim(),
      slug: slug || `cat-${Date.now()}`,
      description: `Surgical category for ${newCatName.trim()}`,
      image_url: '/images/products/integrated-macintosh-fiber-optic-blade.png',
      is_published: true,
      sort_order: categories.length + 1,
    }

    await saveCategory(newCat)
    await reloadCategories()
    setFormData((prev) => ({
      ...prev,
      category_id: newCat.id,
      category_name: newCat.name,
    }))
    setNewCatName('')
    setShowNewCatInput(false)
  }

  const processFile = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setFormData((prev) => ({ ...prev, featured_image: data.url }))
          setIsUploading(false)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setFormData((prev) => ({ ...prev, featured_image: b64 }))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setFormData((prev) => ({ ...prev, featured_image: b64 }))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  // Formatting toolbar logic: wraps selected text or inserts formatted placeholder
  const applyFormatting = (prefix: string, suffix: string = prefix, defaultPlaceholder: string = 'text') => {
    const el = textareaRef.current
    const current = formData.specifications_markdown || ''
    if (!el) {
      setFormData((prev) => ({ ...prev, specifications_markdown: `${current} ${prefix}${defaultPlaceholder}${suffix}` }))
      return
    }

    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const selected = current.substring(start, end)

    const textToWrap = selected.length > 0 ? selected : defaultPlaceholder
    const replacement = `${prefix}${textToWrap}${suffix}`
    const updated = current.substring(0, start) + replacement + current.substring(end)
    setFormData((prev) => ({ ...prev, specifications_markdown: updated }))

    setTimeout(() => {
      el.focus()
      if (selected.length > 0) {
        el.setSelectionRange(start, start + replacement.length)
      } else {
        el.setSelectionRange(start + prefix.length, start + prefix.length + defaultPlaceholder.length)
      }
    }, 15)
  }

  const applyBullet = () => {
    const el = textareaRef.current
    const current = formData.specifications_markdown || ''
    if (!el) {
      setFormData((prev) => ({ ...prev, specifications_markdown: `${current}\n• ` }))
      return
    }

    const start = el.selectionStart ?? current.length
    const end = el.selectionEnd ?? current.length
    const selected = current.substring(start, end)

    if (selected.length > 0) {
      const formatted = selected
        .split('\n')
        .map((l) => (l.trim().startsWith('•') ? l : `• ${l}`))
        .join('\n')
      const updated = current.substring(0, start) + formatted + current.substring(end)
      setFormData((prev) => ({ ...prev, specifications_markdown: updated }))
    } else {
      const lineStart = current.lastIndexOf('\n', start - 1) + 1
      const updated = current.substring(0, lineStart) + '• ' + current.substring(lineStart)
      setFormData((prev) => ({ ...prev, specifications_markdown: updated }))
    }
    setTimeout(() => el.focus(), 15)
  }

  // Sizing chart row management
  const handleUpdateChartRow = (idx: number, field: string, val: string) => {
    const rows = [...(formData.chart_rows || defaultSizingRows)]
    rows[idx] = { ...rows[idx], [field]: val }
    setFormData((prev) => ({ ...prev, chart_rows: rows }))
  }

  const handleDeleteChartRow = (idx: number) => {
    const rows = [...(formData.chart_rows || defaultSizingRows)]
    rows.splice(idx, 1)
    setFormData((prev) => ({ ...prev, chart_rows: rows }))
  }

  const handleAddChartRow = () => {
    const rows = [...(formData.chart_rows || defaultSizingRows)]
    const newIndex = rows.length
    rows.push({
      reference: `TI-RL-${formData.sku || '100'}-${newIndex}`,
      blade: 'Standard',
      size: `Mac-${newIndex}`,
      weight: '100',
      length: 'L120 X H36',
    })
    setFormData((prev) => ({ ...prev, chart_rows: rows }))
  }

  // Built To Perform Cards management
  const handleUpdateBuiltCard = (idx: number, field: string, val: string) => {
    const currentBuilt = formData.built_to_perform || defaultBuiltToPerform
    const cards = [...currentBuilt.cards]
    cards[idx] = { ...cards[idx], [field]: val }
    setFormData((prev) => ({
      ...prev,
      built_to_perform: { ...currentBuilt, cards },
    }))
  }

  // Related products management & image upload
  const processRelFile = async (file: File) => {
    if (!file) return
    setIsRelUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setNewRelImage(data.url)
          setIsRelUploading(false)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setNewRelImage(b64)
        setIsRelUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setNewRelImage(b64)
        setIsRelUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCustomRelatedProduct = () => {
    if (!newRelTitle.trim()) return
    const customList = [...(formData.custom_related_products || [])]
    customList.push({
      id: `rel-${Date.now()}`,
      title: newRelTitle.trim(),
      sku: newRelSku.trim() || 'TI-RL-100',
      image: newRelImage || '/images/products/integrated-macintosh-fiber-optic-blade.png',
      slug: newRelTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'),
    })
    setFormData((prev) => ({ ...prev, custom_related_products: customList }))
    setNewRelTitle('')
    setNewRelSku('')
    setNewRelImage('/images/products/integrated-macintosh-fiber-optic-blade.png')
  }

  const handleDeleteRelatedProduct = (idx: number) => {
    const customList = [...(formData.custom_related_products || [])]
    customList.splice(idx, 1)
    setFormData((prev) => ({ ...prev, custom_related_products: customList }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setIsSaving(true)
    try {
      const prodToSave: ProductItem = {
        id: formData.id || `prod-${Date.now()}`,
        category_id: formData.category_id || null,
        category_name: formData.category_name || null,
        title: formData.title,
        slug: formData.slug || `prod-${Date.now()}`,
        sku: formData.sku || null,
        price: Number(formData.price) || null,
        stock_quantity: Number(formData.stock_quantity) || 0,
        badge: formData.badge || null,
        is_featured: Boolean(formData.is_featured),
        is_published: Boolean(formData.is_published),
        short_description: formData.short_description || null,
        full_description: formData.full_description || null,
        specifications_markdown: formData.specifications_markdown || null,
        product_type: formData.product_type || 'Macintosh Blades',
        material: formData.material || 'Stainless Steel',
        chart_rows: formData.chart_rows && formData.chart_rows.length > 0 ? formData.chart_rows : defaultSizingRows,
        built_to_perform: formData.built_to_perform || defaultBuiltToPerform,
        custom_related_products: formData.custom_related_products || [],
        related_product_ids: formData.related_product_ids || [],
        featured_image:
          formData.featured_image || '/images/products/integrated-macintosh-fiber-optic-blade.png',
        sort_order: Number(formData.sort_order) || 1,
      }

      await saveProduct(prodToSave)
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  const samplePresets = [
    { label: 'Macintosh Blade', url: '/images/products/integrated-macintosh-fiber-optic-blade.png' },
    { label: 'Blade Angle 1', url: '/images/products/laryngoscope-attachment-1.png' },
    { label: 'Blade Angle 2', url: '/images/products/laryngoscope-attachment-2.png' },
    { label: 'Laryngoscope Hero', url: '/image 431.svg' },
  ]

  const chartRows = formData.chart_rows || defaultSizingRows
  const builtCards = formData.built_to_perform?.cards || defaultBuiltToPerform.cards

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F6851F]/20 flex items-center justify-center text-[#F6851F]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {product ? 'Edit Surgical Product' : 'Add New Surgical Product'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Configure images, category filters, sizing specification table, and store details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-800">
          {/* ──────────────────────────────────────────────────────── */}
          {/* 1. PRODUCT IMAGE UPLOAD & PLACEHOLDER                    */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-[#081022] uppercase tracking-wide">
                  Product Image Placeholder & Upload *
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload an image directly from your device or pick a preset image.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-[#F6851F] font-bold hover:underline inline-flex items-center gap-1"
              >
                <Link2 className="w-3 h-3" />
                {showUrlInput ? 'Hide URL Input' : 'Enter Image URL'}
              </button>
            </div>

            {/* Direct URL Input fallback */}
            {showUrlInput && (
              <div className="pt-1">
                <input
                  type="text"
                  placeholder="https://... or /images/..."
                  value={formData.featured_image || ''}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            )}

            {/* Drag & Drop Upload Zone + Live Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Preview Box */}
              <div className="sm:col-span-4 relative aspect-[4/3] rounded-2xl bg-white border-2 border-dashed border-zinc-300 overflow-hidden flex items-center justify-center p-2 group shadow-inner">
                {formData.featured_image ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={formData.featured_image}
                      alt="Product preview"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white text-[10px] px-2 py-1 truncate text-center font-mono">
                      {formData.featured_image}
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 text-zinc-400">
                    <ImageIcon className="w-8 h-8 mx-auto mb-1 stroke-1" />
                    <span className="text-[11px] font-medium">No Image Selected</span>
                  </div>
                )}
              </div>

              {/* Upload Drop Area */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`sm:col-span-8 border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[140px] ${
                  isDragOver
                    ? 'border-[#F6851F] bg-orange-50/70'
                    : 'border-zinc-300 hover:border-[#F6851F] bg-white'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      processFile(e.target.files[0])
                    }
                  }}
                  className="hidden"
                />

                <div className="w-10 h-10 rounded-full bg-[#F6851F]/10 flex items-center justify-center text-[#F6851F] mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-zinc-800">
                  {isUploading ? 'Uploading Image...' : 'Click or Drag & Drop Product Image'}
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">PNG, JPG, SVG, WebP (Max 5MB)</p>
              </div>
            </div>

            {/* Quick Preset Selector */}
            <div className="pt-2">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Quick Surgical Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, featured_image: preset.url })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition flex items-center gap-1.5 ${
                      formData.featured_image === preset.url
                        ? 'border-[#F6851F] bg-[#F6851F]/10 text-[#F6851F] font-bold'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                    }`}
                  >
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 2. CATEGORIZATION & STORE FILTERS                       */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#F6851F]" />
                <h4 className="text-xs font-bold text-[#081022] uppercase tracking-wide">
                  Categorization & Store Filters
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                Controls /products Filter
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Product Category Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#081022]">Product Category *</label>
                  <button
                    type="button"
                    onClick={() => setShowNewCatInput(!showNewCatInput)}
                    className="text-[10px] text-[#F6851F] font-bold hover:underline inline-flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" /> New
                  </button>
                </div>
                <select
                  value={formData.category_id || ''}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-medium"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type (Filter Group 2) */}
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Product Type *</label>
                <select
                  value={formData.product_type || 'Macintosh Blades'}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-medium"
                >
                  <option value="Macintosh Blades">Macintosh Blades</option>
                  <option value="Miller Blades">Miller Blades</option>
                  <option value="Conventional Single Use">Conventional Single Use</option>
                  <option value="Plastic / Fiber Optic">Plastic / Fiber Optic</option>
                </select>
              </div>

              {/* Material (Filter Group 3) */}
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Material *</label>
                <select
                  value={formData.material || 'Stainless Steel'}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-medium"
                >
                  <option value="Stainless Steel">Stainless Steel</option>
                  <option value="Fiber Optic">Fiber Optic</option>
                  <option value="Plastic">Plastic</option>
                </select>
              </div>
            </div>

            {/* Quick Create New Category Inline */}
            {showNewCatInput && (
              <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 flex flex-col sm:flex-row items-center gap-2 animate-in fade-in">
                <input
                  type="text"
                  placeholder="Enter new category name (e.g. Disposable Airway Systems)"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-lg bg-white border border-orange-300 focus:outline-none w-full"
                />
                <button
                  type="button"
                  onClick={handleCreateNewCategory}
                  className="px-4 py-2 bg-[#F6851F] text-white text-xs font-bold rounded-lg shadow-sm hover:bg-[#E07314] shrink-0 w-full sm:w-auto"
                >
                  Add Category
                </button>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 3. PRODUCT CORE INFO (TITLE, SKU, PRICE, BADGE)          */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Instrument Title *</label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Integrated Macintosh Fiber Optic Blade"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">SKU Reference Code</label>
              <input
                type="text"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="TI-RL-100"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Wholesale Price (USD)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price ?? ''}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Stock Quantity</label>
              <input
                type="number"
                value={formData.stock_quantity ?? 100}
                onChange={(e) =>
                  setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Badge Tag</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="REUSABLE SURGICAL GRADE"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 4. SPECIFICATIONS (RICH TEXT FORMATTER WITH LIVE CURSOR)  */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/60 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-bold text-[#081022]">
                  Product Specifications (Shown on Large Page)
                </label>
                <p className="text-[11px] text-slate-500">
                  Select text and click Bold or Italic, or insert bullets. Output will display live on the website.
                </p>
              </div>

              {/* Rich Formatting Toolbar */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-zinc-200 shadow-xs">
                <button
                  type="button"
                  title="Bold (**text**)"
                  onClick={() => applyFormatting('**', '**', 'bold text')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-black text-zinc-800 transition"
                >
                  B
                </button>
                <button
                  type="button"
                  title="Italic (*text*)"
                  onClick={() => applyFormatting('*', '*', 'italic text')}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs italic font-serif text-zinc-800 transition"
                >
                  I
                </button>
                <button
                  type="button"
                  title="Add Bullet Point"
                  onClick={applyBullet}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-bold text-zinc-800 transition"
                >
                  • Bullet
                </button>
                <button
                  type="button"
                  title="Add Next Line"
                  onClick={() => {
                    const el = textareaRef.current
                    const current = formData.specifications_markdown || ''
                    if (!el) {
                      setFormData({ ...formData, specifications_markdown: current + '\n' })
                      return
                    }
                    const start = el.selectionStart ?? current.length
                    const updated = current.substring(0, start) + '\n' + current.substring(start)
                    setFormData({ ...formData, specifications_markdown: updated })
                    setTimeout(() => {
                      el.focus()
                      el.setSelectionRange(start + 1, start + 1)
                    }, 15)
                  }}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-semibold text-zinc-800 transition"
                >
                  ↵ Next Line
                </button>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              rows={5}
              value={formData.specifications_markdown || ''}
              onChange={(e) => setFormData({ ...formData, specifications_markdown: e.target.value })}
              placeholder="• Completely Sealed One Piece BLADE CONSTRUCTION&#10;• Distal Lip Of All Integrated Blades&#10;• Crafted From Finest Stainless Steel AISI 303 / 304"
              className="w-full text-xs p-3 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-mono leading-relaxed"
            />

            {/* Live Output Preview */}
            {formData.specifications_markdown && (
              <div className="pt-2 border-t border-orange-200/50">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#F36C21] mb-1.5">
                  Live Output Preview:
                </p>
                <div className="bg-white p-3 rounded-xl border border-zinc-200 text-xs text-slate-700 space-y-1.5 max-h-36 overflow-y-auto">
                  {formData.specifications_markdown
                    .split('\n')
                    .filter((l) => l.trim())
                    .map((line, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-2">
                        <span className="text-[#F36C21] font-bold">•</span>
                        <span>
                          {line
                            .replace(/^[•\-\*]\s*/, '')
                            .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
                            .map((tok, tIdx) => {
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
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 5. SIZING SPECIFICATION TABLE                            */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-[#F6851F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#081022] uppercase tracking-wide">
                    Sizing Specifications Table
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Add, edit, or delete sizing rows (Reference, Blade, Size, Weight, Overall Length)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddChartRow}
                className="px-3 py-1.5 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Row
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#081022] text-white font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Reference</th>
                    <th className="py-2.5 px-3">Blade</th>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Weight (g)</th>
                    <th className="py-2.5 px-3">Overall Length</th>
                    <th className="py-2.5 px-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chartRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition">
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.reference}
                          onChange={(e) => handleUpdateChartRow(idx, 'reference', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-xs focus:outline-none focus:border-[#F6851F]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.blade}
                          onChange={(e) => handleUpdateChartRow(idx, 'blade', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#F6851F]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.size}
                          onChange={(e) => handleUpdateChartRow(idx, 'size', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-xs focus:outline-none focus:border-[#F6851F]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.weight}
                          onChange={(e) => handleUpdateChartRow(idx, 'weight', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#F6851F]"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={row.length}
                          onChange={(e) => handleUpdateChartRow(idx, 'length', e.target.value)}
                          className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#F6851F]"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteChartRow(idx)}
                          title="Delete row"
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 6. BUILT TO PERFORM. MADE TO LAST. SECTION (4 CARDS)     */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#F6851F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#081022] uppercase tracking-wide">
                    &ldquo;BUILT TO PERFORM. MADE TO LAST.&rdquo; Section
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Customize the 4 cards (Product Catalogs, Quality Standards, OEM, Materials) for this product
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, built_to_perform: defaultBuiltToPerform })}
                className="text-xs text-[#F6851F] font-bold hover:underline"
              >
                Reset To Default
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Section Main Heading</label>
              <input
                type="text"
                value={formData.built_to_perform?.heading || 'BUILT TO PERFORM. MADE TO LAST.'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    built_to_perform: {
                      ...(formData.built_to_perform || defaultBuiltToPerform),
                      heading: e.target.value,
                    },
                  })
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-bold"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {builtCards.map((card, cIdx) => (
                <div key={cIdx} className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#F6851F] uppercase tracking-wider">
                      Card {cIdx + 1}
                    </span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleUpdateBuiltCard(cIdx, 'title', e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 font-semibold focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-0.5">Description</label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => handleUpdateBuiltCard(cIdx, 'description', e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Link Text</label>
                      <input
                        type="text"
                        value={card.link_text}
                        onChange={(e) => handleUpdateBuiltCard(cIdx, 'link_text', e.target.value)}
                        className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-0.5">Link URL</label>
                      <input
                        type="text"
                        value={card.link_url}
                        onChange={(e) => handleUpdateBuiltCard(cIdx, 'link_url', e.target.value)}
                        className="w-full text-xs px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────── */}
          {/* 7. RELATED PRODUCTS SECTION                              */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F6851F]" />
                <div>
                  <h4 className="text-xs font-bold text-[#081022] uppercase tracking-wide">
                    Related Products
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Upload and configure related surgical products with image placeholder & details
                  </p>
                </div>
              </div>
            </div>

            {/* List of currently attached related products */}
            {(formData.custom_related_products || []).length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Attached Related Products ({(formData.custom_related_products || []).length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {(formData.custom_related_products || []).map((rel, rIdx) => (
                    <div
                      key={rIdx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-[#F8FAFC] group hover:border-[#F6851F]/40 transition"
                    >
                      <div className="relative w-14 h-14 bg-white rounded-lg border border-slate-200 overflow-hidden shrink-0 shadow-inner">
                        <Image
                          src={rel.image || '/images/products/integrated-macintosh-fiber-optic-blade.png'}
                          alt={rel.title}
                          fill
                          unoptimized
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{rel.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{rel.sku || 'TI-RL-100'}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRelatedProduct(rIdx)}
                        title="Remove related product"
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Related Product Box with Dedicated Image Placeholder & Upload */}
            <div className="p-5 rounded-2xl bg-[#FFF8F3] border border-orange-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F6851F] uppercase tracking-wide flex items-center gap-1.5">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add More Related Products
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  Upload images & configure related items
                </span>
              </div>

              {/* Related Product Image Placeholder & Upload Area */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Related Product Image Placeholder & Upload *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Image Placeholder Preview */}
                  <div className="sm:col-span-4 relative aspect-[4/3] rounded-xl bg-white border-2 border-dashed border-orange-300 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                    {newRelImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={newRelImage}
                          alt="Related product preview"
                          fill
                          unoptimized
                          className="object-contain"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-900/80 text-white text-[9px] px-1 py-0.5 truncate text-center font-mono">
                          {newRelImage}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-2 text-zinc-400">
                        <ImageIcon className="w-6 h-6 mx-auto mb-1 stroke-1" />
                        <span className="text-[10px] font-medium">Image Placeholder</span>
                      </div>
                    )}
                  </div>

                  {/* Dropzone Upload Button */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsRelDragOver(true)
                    }}
                    onDragLeave={() => setIsRelDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsRelDragOver(false)
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        processRelFile(e.dataTransfer.files[0])
                      }
                    }}
                    onClick={() => relFileInputRef.current?.click()}
                    className={`sm:col-span-8 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[110px] ${
                      isRelDragOver
                        ? 'border-[#F6851F] bg-orange-100/70'
                        : 'border-orange-300 hover:border-[#F6851F] bg-white'
                    }`}
                  >
                    <input
                      ref={relFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          processRelFile(e.target.files[0])
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-8 h-8 rounded-full bg-[#F6851F]/10 flex items-center justify-center text-[#F6851F] mb-1">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-bold text-zinc-800">
                      {isRelUploading ? 'Uploading Image...' : 'Click or Drag & Drop Related Product Image'}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, SVG, WebP</p>
                  </div>
                </div>

                {/* Preset image buttons */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider self-center mr-1">
                    Presets:
                  </span>
                  {[
                    { label: 'Macintosh', url: '/images/products/integrated-macintosh-fiber-optic-blade.png' },
                    { label: 'Angle 1', url: '/images/products/laryngoscope-attachment-1.png' },
                    { label: 'Angle 2', url: '/images/products/laryngoscope-attachment-2.png' },
                    { label: 'Hero', url: '/image 431.svg' },
                  ].map((p, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => setNewRelImage(p.url)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                        newRelImage === p.url
                          ? 'border-[#F6851F] bg-[#F6851F] text-white font-bold'
                          : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title & SKU Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    value={newRelTitle}
                    onChange={(e) => setNewRelTitle(e.target.value)}
                    placeholder="e.g. Miller Fiber Optic Blade"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#F6851F]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={newRelSku}
                    onChange={(e) => setNewRelSku(e.target.value)}
                    placeholder="e.g. TI-RL-200"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-slate-200 focus:outline-none focus:border-[#F6851F] font-mono"
                  />
                </div>
              </div>

              {/* Add More Related Product Button */}
              <div className="pt-1 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddCustomRelatedProduct}
                  className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  Add More Related Product
                </button>
                <span className="text-[11px] text-zinc-500">
                  Click to attach this related product and add another one
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#081022]">
              <input
                type="checkbox"
                checked={Boolean(formData.is_published)}
                onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                className="w-4 h-4 text-[#F6851F] rounded"
              />
              <span>Published in Storefront</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#081022]">
              <input
                type="checkbox"
                checked={Boolean(formData.is_featured)}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 text-[#F6851F] rounded"
              />
              <span>Featured on Homepage</span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-between">
            <Link
              href="/admin/categories"
              target="_blank"
              className="text-xs font-bold text-[#F6851F] hover:underline flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Manage All Categories</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
