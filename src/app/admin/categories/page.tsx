'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  FolderOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Stethoscope,
} from 'lucide-react'
import {
  getStoredCategories,
  saveCategory,
  deleteCategory,
  moveCategoryOrder,
} from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types'
import CategoryModal from '@/src/components/admin/CategoryModal'

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'airway' | 'diagnostics'>('all')
  const [modalCategory, setModalCategory] = useState<CategoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  const reloadData = () => {
    setCategories(getStoredCategories())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const showNotice = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleDelete = async (cat: CategoryItem) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return
    await deleteCategory(cat.id)
    reloadData()
    showNotice(`Deleted "${cat.name}"`)
  }

  const handleTogglePublished = async (cat: CategoryItem) => {
    await saveCategory({ ...cat, is_published: !cat.is_published })
    reloadData()
    showNotice(`Toggled status for "${cat.name}"`)
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    moveCategoryOrder(id, direction)
    reloadData()
    showNotice('Category position updated')
  }

  const handleOpenAdd = (targetSection: 'airway' | 'diagnostics' = 'airway') => {
    setModalCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      image_url: targetSection === 'airway' ? '/Rectangle 819 (1).svg' : '/image 351 (1).svg',
      card_image: targetSection === 'airway' ? '/Rectangle 819 (1).svg' : '/image 351 (1).svg',
      sort_order: categories.length + 1,
      is_published: true,
      section: targetSection,
      section_label:
        targetSection === 'diagnostics'
          ? 'Section 2: Diagnostics & Otoscopy'
          : 'Section 1: Airway Management',
    })
    setIsModalOpen(true)
  }

  const airwayCount = categories.filter(
    (c) => c.section === 'airway' || !c.section || c.section === 'section_1'
  ).length
  const diagnosticsCount = categories.filter(
    (c) => c.section === 'diagnostics' || c.section === 'section_2'
  ).length

  const filtered = categories.filter((c) => {
    if (activeTab === 'airway') {
      if (c.section === 'diagnostics' || c.section === 'section_2') return false
    }
    if (activeTab === 'diagnostics') {
      if (c.section !== 'diagnostics' && c.section !== 'section_2') return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        (c.description || '').toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Main Categories &amp; Showcase Management
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Separated into Section 1 (Airway / Laryngoscopes) and Section 2 (Diagnostics &amp; Otoscopy) for instant homepage sync.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => handleOpenAdd('airway')}
            className="px-4 py-2.5 bg-[#081022] hover:bg-[#1a233a] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F6851F]" />
            <span>+ Add to Section 1 (Airway)</span>
          </button>
          <button
            onClick={() => handleOpenAdd('diagnostics')}
            className="px-4 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add to Section 2 (Diagnostics)</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Showcase Section Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'all'
              ? 'bg-[#081022] text-white shadow'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <span>All Categories</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{categories.length}</span>
        </button>

        <button
          onClick={() => setActiveTab('airway')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'airway'
              ? 'bg-[#F6851F] text-white shadow'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Section 1: Airway Showcase</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{airwayCount}</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'diagnostics'
              ? 'bg-[#1E3A8A] text-white shadow'
              : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5" />
          <span>Section 2: Diagnostics Showcase</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20">{diagnosticsCount}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search specialties & categories..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          Showing {filtered.length} of {categories.length}
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 w-16">Reorder</th>
                <th className="px-5 py-3.5">Category Details</th>
                <th className="px-5 py-3.5">Showcase Section</th>
                <th className="px-5 py-3.5">Slug URL</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((cat, idx) => {
                const isDiag = cat.section === 'diagnostics' || cat.section === 'section_2'
                return (
                  <tr key={cat.id} className="hover:bg-[#FAFAFC] transition">
                    {/* Reorder Buttons */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(cat.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-zinc-400 hover:text-[#081022] disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(cat.id, 'down')}
                          disabled={idx === filtered.length - 1}
                          className="p-1 text-zinc-400 hover:text-[#081022] disabled:opacity-30 disabled:hover:text-zinc-400 transition"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200 flex items-center justify-center p-1">
                          <Image
                            src={cat.card_image || cat.image_url || '/image 351 (1).svg'}
                            alt={cat.name}
                            fill
                            unoptimized
                            className="object-contain p-1"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-[#081022] text-xs">{cat.name}</p>
                          <p className="text-[11px] text-[#4B5D71] line-clamp-1 max-w-sm">
                            {cat.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Showcase Section Badge */}
                    <td className="px-5 py-3.5">
                      {isDiag ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Stethoscope className="w-3 h-3" />
                          <span>Section 2: Diagnostics</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                          <Layers className="w-3 h-3" />
                          <span>Section 1: Airway</span>
                        </span>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="px-5 py-3.5 font-mono text-zinc-500 text-[11px]">
                      /{cat.slug}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleTogglePublished(cat)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                          cat.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        {cat.is_published ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/products?category=${cat.slug}`}
                          target="_blank"
                          title="View on Store"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-[#081022] hover:bg-zinc-100 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setModalCategory(cat)
                            setIsModalOpen(true)
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        category={modalCategory}
        onClose={() => setIsModalOpen(false)}
        onSaved={reloadData}
      />
    </div>
  )
}
