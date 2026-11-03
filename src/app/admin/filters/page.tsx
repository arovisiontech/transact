'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Filter,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Check,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStoredFilterFacets,
  saveFilterFacets,
  getStoredCategories,
  FilterFacets,
} from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types'

export default function AdminFiltersPage() {
  const [facets, setFacets] = useState<FilterFacets>({
    productTypes: ['Macintosh Blades', 'Miller Blades', 'Conventional Single Use', 'Plastic / Fiber Optic'],
    materials: ['Stainless Steel', 'Fiber Optic'],
  })
  const [categories, setCategories] = useState<CategoryItem[]>([])

  const [newType, setNewType] = useState('')
  const [newMaterial, setNewMaterial] = useState('')

  const reloadData = () => {
    setFacets(getStoredFilterFacets())
    setCategories(getStoredCategories())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const handleAddType = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newType.trim()) return
    if (facets.productTypes.includes(newType.trim())) {
      toast.error('This product type already exists')
      return
    }
    const updated = {
      ...facets,
      productTypes: [...facets.productTypes, newType.trim()],
    }
    setFacets(updated)
    saveFilterFacets(updated)
    setNewType('')
    toast.success(`Added "${newType.trim()}" to product types`)
  }

  const handleDeleteType = (typeToDelete: string) => {
    const updated = {
      ...facets,
      productTypes: facets.productTypes.filter((t) => t !== typeToDelete),
    }
    setFacets(updated)
    saveFilterFacets(updated)
    toast.success(`Removed "${typeToDelete}"`)
  }

  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMaterial.trim()) return
    if (facets.materials.includes(newMaterial.trim())) {
      toast.error('This material already exists')
      return
    }
    const updated = {
      ...facets,
      materials: [...facets.materials, newMaterial.trim()],
    }
    setFacets(updated)
    saveFilterFacets(updated)
    setNewMaterial('')
    toast.success(`Added "${newMaterial.trim()}" to materials`)
  }

  const handleDeleteMaterial = (matToDelete: string) => {
    const updated = {
      ...facets,
      materials: facets.materials.filter((m) => m !== matToDelete),
    }
    setFacets(updated)
    saveFilterFacets(updated)
    toast.success(`Removed "${matToDelete}"`)
  }

  const handleResetDefaults = () => {
    const defaults: FilterFacets = {
      productTypes: ['Macintosh Blades', 'Miller Blades', 'Conventional Single Use', 'Plastic / Fiber Optic'],
      materials: ['Stainless Steel', 'Fiber Optic'],
    }
    setFacets(defaults)
    saveFilterFacets(defaults)
    toast.success('Filters reset to defaults!')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <Filter className="w-4 h-4" />
            <span>Storefront Navigation Facets (SS 4)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022] mt-1">
            Product Filters &amp; Facets Management
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Manage the Product Category, Product Type, and Material checkboxes displayed in the catalog sidebar (Screenshot 4).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <Link
            href="/products"
            target="_blank"
            className="px-4 py-2 bg-[#081022] hover:bg-[#F6851F] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
          >
            <span>View Live Catalog →</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Main Product Categories (Read & Link) */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-[#081022]">
                  1. Product Categories (4 Main Categories)
                </h2>
                <p className="text-xs text-zinc-500">
                  These 4 main categories automatically populate the first filter group in Screenshot 4.
                </p>
              </div>
              <Link
                href="/admin/categories"
                className="text-xs font-bold text-[#F6851F] hover:underline"
              >
                Manage Categories →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{cat.icon || '📦'}</span>
                    <div>
                      <p className="text-xs font-bold text-[#081022]">{cat.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">/{cat.slug}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Product Types Management */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-sm font-black text-[#081022]">
                2. Product Types Filter (SS 4 Group 2)
              </h2>
              <p className="text-xs text-zinc-500">
                Add, edit, or remove specific instrument types (e.g. Macintosh Blades, Miller Blades, etc.).
              </p>
            </div>

            <form onSubmit={handleAddType} className="flex gap-2">
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="Add new Product Type (e.g. Otoscope Specula)"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Type</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {facets.productTypes.map((type) => (
                <div
                  key={type}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition"
                >
                  <span className="text-xs font-bold text-zinc-800">{type}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteType(type)}
                    className="p-1 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title={`Remove ${type}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Material Management */}
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="border-b border-zinc-100 pb-3">
              <h2 className="text-sm font-black text-[#081022]">
                3. Materials Filter (SS 4 Group 3)
              </h2>
              <p className="text-xs text-zinc-500">
                Add, edit, or remove metallurgy and material options (e.g. Stainless Steel, Fiber Optic, Titanium).
              </p>
            </div>

            <form onSubmit={handleAddMaterial} className="flex gap-2">
              <input
                type="text"
                value={newMaterial}
                onChange={(e) => setNewMaterial(e.target.value)}
                placeholder="Add new Material (e.g. Titanium / AISI 420)"
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Material</span>
              </button>
            </form>

            <div className="space-y-2 pt-2">
              {facets.materials.map((mat) => (
                <div
                  key={mat}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 border border-zinc-200 hover:border-zinc-300 transition"
                >
                  <span className="text-xs font-bold text-zinc-800">{mat}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMaterial(mat)}
                    className="p-1 text-zinc-400 hover:text-red-600 transition cursor-pointer"
                    title={`Remove ${mat}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Column (4 Cols - EXACT MATCH TO SCREENSHOT 4) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
            Live Preview (Screenshot 4)
          </span>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-6 space-y-6 shadow-xs sticky top-6">
            <h3 className="font-bold text-slate-900 text-lg">Filters</h3>

            {/* Product Category Group */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Product Category</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#F36C21] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">All Categories</span>
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-slate-300 bg-white" />
                    <span className="text-sm text-slate-700 font-medium">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Type Group */}
            <div className="space-y-3 pt-2 border-t border-slate-200/70">
              <h4 className="text-sm font-bold text-slate-900">Product Type</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#F36C21] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">All Types</span>
                </div>
                {facets.productTypes.map((type) => (
                  <div key={type} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-slate-300 bg-white" />
                    <span className="text-sm text-slate-700 font-medium">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Material Group */}
            <div className="space-y-3 pt-2 border-t border-slate-200/70">
              <h4 className="text-sm font-bold text-slate-900">Material</h4>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-[#F36C21] text-white flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-sm text-slate-900 font-medium">All Materials</span>
                </div>
                {facets.materials.map((mat) => (
                  <div key={mat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-slate-300 bg-white" />
                    <span className="text-sm text-slate-700 font-medium">{mat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
