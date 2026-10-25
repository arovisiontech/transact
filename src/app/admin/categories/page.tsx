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
  const [modalCategory, setModalCategory] = useState<CategoryItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  const reloadData = () => {
    setCategories(getStoredCategories())
  }

  useEffect(() => {
    reloadData()
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

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Specialties & Category Management
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Organize surgical specialties, add new procedure lines, and reorder navigation.
          </p>
        </div>

        <button
          onClick={() => {
            setModalCategory(null)
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Specialty</span>
        </button>
      </div>

      {actionNotice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search specialties..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {filtered.length} Categories
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
                <th className="px-5 py-3.5">Slug Identifier</th>
                <th className="px-5 py-3.5">Instruments Count</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-[#FAFAFC] transition">
                  {/* Reorder Buttons */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(cat.id, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(cat.id, 'down')}
                        disabled={idx === filtered.length - 1}
                        title="Move Down"
                        className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Name & Image */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                        <Image
                          src={cat.card_image || cat.image_url || '/images/transact/image5_3812_2.jpg'}
                          alt={cat.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#081022] truncate">{cat.name}</p>
                        <p className="text-[11px] text-zinc-400 truncate max-w-xs">{cat.description || 'Specialty category'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-3.5 font-mono text-zinc-600">
                    /{cat.slug}
                  </td>

                  {/* Count */}
                  <td className="px-5 py-3.5 font-mono font-bold text-[#081022]">
                    {cat.product_count || 12} Items
                  </td>

                  {/* Status Toggle */}
                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleTogglePublished(cat)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition ${
                        cat.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                      }`}
                    >
                      {cat.is_published ? 'Active' : 'Disabled'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/categories/${cat.slug}`}
                        target="_blank"
                        title="View Category on Store"
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-[#081022] hover:bg-zinc-100 transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => {
                          setModalCategory(cat)
                          setIsModalOpen(true)
                        }}
                        title="Edit Category"
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        title="Delete Category"
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        category={modalCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reloadData}
      />
    </div>
  )
}
