'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Eye,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCategories,
  deleteProduct,
  saveProduct,
  moveProductOrder,
} from '@/src/lib/dataStore'
import { ProductItem, CategoryItem } from '@/src/types'
import ProductModal from '@/src/components/admin/ProductModal'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [modalProduct, setModalProduct] = useState<ProductItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [actionNotice, setActionNotice] = useState('')

  const reloadData = async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/categories', { cache: 'no-store' }),
      ])
      if (pRes.ok) {
        const liveProds = await pRes.json()
        if (Array.isArray(liveProds)) {
          setProducts(liveProds)
        } else {
          setProducts(getStoredProducts())
        }
      } else {
        setProducts(getStoredProducts())
      }
      if (cRes.ok) {
        const liveCats = await cRes.json()
        if (Array.isArray(liveCats)) {
          setCategories(liveCats)
        } else {
          setCategories(getStoredCategories())
        }
      } else {
        setCategories(getStoredCategories())
      }
    } catch {
      setProducts(getStoredProducts())
      setCategories(getStoredCategories())
    }
  }

  useEffect(() => {
    reloadData()
  }, [])

  const showNotice = (msg: string) => {
    setActionNotice(msg)
    setTimeout(() => setActionNotice(''), 3000)
  }

  const handleDelete = async (prod: ProductItem) => {
    if (!confirm(`Are you sure you want to delete "${prod.title}"?`)) return
    await deleteProduct(prod.id)
    await reloadData()
    showNotice(`Deleted "${prod.title}" - Saved to disk & live!`)
  }

  const handleTogglePublished = async (prod: ProductItem) => {
    await saveProduct({ ...prod, is_published: !prod.is_published })
    await reloadData()
    showNotice(`Updated visibility for "${prod.title}" - Saved live!`)
  }

  const handleToggleFeatured = async (prod: ProductItem) => {
    await saveProduct({ ...prod, is_featured: !prod.is_featured })
    reloadData()
    showNotice(`Updated featured status for "${prod.title}"`)
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    moveProductOrder(id, direction)
    reloadData()
    showNotice('Order updated successfully')
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase())
    const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory
    return matchesSearch && matchesCat
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Surgical Instruments Inventory
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Add, edit, move order, and manage visibility of hospital procedure products.
          </p>
        </div>

        <button
          onClick={() => {
            setModalProduct(null)
            setIsModalOpen(true)
          }}
          className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Instrument</span>
        </button>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or SKU..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs px-3 py-2 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-semibold text-zinc-700 w-full sm:w-auto"
          >
            <option value="all">All Specialties ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="text-xs text-zinc-400 shrink-0 font-medium hidden sm:inline">
            {filtered.length} Items
          </span>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 w-16">Reorder</th>
                <th className="px-5 py-3.5">Instrument Details</th>
                <th className="px-5 py-3.5">SKU & Code</th>
                <th className="px-5 py-3.5">Specialty</th>
                <th className="px-5 py-3.5">Wholesale Price</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Featured</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-zinc-400">
                    No surgical instruments found.
                  </td>
                </tr>
              ) : (
                filtered.map((prod, idx) => (
                  <tr key={prod.id} className="hover:bg-[#FAFAFC] transition">
                    {/* Move Up / Move Down */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMove(prod.id, 'up')}
                          disabled={idx === 0}
                          title="Move Up"
                          className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(prod.id, 'down')}
                          disabled={idx === filtered.length - 1}
                          title="Move Down"
                          className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Product Name & Image */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 overflow-hidden relative shrink-0 p-1">
                          <Image
                            src={prod.featured_image || '/images/transact/image5_3812_2.jpg'}
                            alt={prod.title}
                            fill
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#081022] truncate max-w-xs">{prod.title}</p>
                          <span className="text-[10px] text-zinc-400 font-mono">ID: {prod.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-5 py-3.5 font-mono text-zinc-600 font-semibold">
                      {prod.sku || 'N/A'}
                    </td>

                    {/* Category */}
                    <td className="px-5 py-3.5 text-zinc-600 font-medium">
                      {prod.category_name || 'General'}
                    </td>

                    {/* Price */}
                    <td className="px-5 py-3.5 font-mono font-bold text-[#081022]">
                      {prod.price ? `$${prod.price.toFixed(2)}` : 'RFQ'}
                    </td>

                    {/* Published Toggle */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleTogglePublished(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition ${
                          prod.is_published
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                      >
                        {prod.is_published ? 'Active' : 'Draft'}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(prod)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition ${
                          prod.is_featured
                            ? 'bg-[#FFF4EB] text-[#F6851F] border border-[#F6851F]/30'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {prod.is_featured ? 'Featured ★' : 'No'}
                      </button>
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products/${prod.slug}`}
                          target="_blank"
                          title="View on Storefront"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-[#081022] hover:bg-zinc-100 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setModalProduct(prod)
                            setIsModalOpen(true)
                          }}
                          title="Edit Instrument"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(prod)}
                          title="Delete Instrument"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        product={modalProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={async () => {
          await reloadData()
          showNotice('Product successfully saved to disk & live across all devices!')
        }}
      />
    </div>
  )
}
