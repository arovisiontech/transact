'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Save,
  X,
  FolderOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStoredCategories,
  getStoredSubcategories,
  saveSubcategory,
  deleteSubcategory,
} from '@/src/lib/dataStore'
import { CategoryItem, SubcategoryItem } from '@/src/types'

export default function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubcat, setEditingSubcat] = useState<SubcategoryItem | null>(null)

  const [formData, setFormData] = useState<SubcategoryItem>({
    id: '',
    category_id: 'cat-reusable-laryngoscopes',
    category_name: 'Reusable Laryngoscopes',
    name: '',
    slug: '',
    description: '',
    sort_order: 1,
    is_active: true,
  })

  const reloadData = () => {
    const cats = getStoredCategories()
    setCategories(cats)
    setSubcategories(getStoredSubcategories())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const handleOpenAdd = () => {
    setEditingSubcat(null)
    const firstCat = categories[0] || { id: 'cat-reusable-laryngoscopes', name: 'Reusable Laryngoscopes' }
    setFormData({
      id: `subcat-${Date.now()}`,
      category_id: firstCat.id,
      category_name: firstCat.name,
      name: '',
      slug: '',
      description: '',
      sort_order: subcategories.length + 1,
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (subcat: SubcategoryItem) => {
    setEditingSubcat(subcat)
    setFormData({ ...subcat })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast.error('Subcategory name is required')
      return
    }

    const parent = categories.find((c) => c.id === formData.category_id)
    const toSave: SubcategoryItem = {
      ...formData,
      category_name: parent?.name || formData.category_name,
      slug:
        formData.slug.trim() ||
        formData.name
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_-]+/g, '-'),
    }

    await saveSubcategory(toSave)
    toast.success(editingSubcat ? 'Subcategory updated!' : 'New subcategory added!')
    setIsModalOpen(false)
    reloadData()
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete subcategory "${name}"?`)) {
      await deleteSubcategory(id)
      toast.success('Subcategory deleted')
      reloadData()
    }
  }

  const handleToggleActive = async (item: SubcategoryItem) => {
    const updated = { ...item, is_active: !item.is_active }
    await saveSubcategory(updated)
    toast.success(`Subcategory is now ${updated.is_active ? 'Active' : 'Disabled'}`)
    reloadData()
  }

  const filtered = subcategories.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Subcategories &amp; Product Divisions
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Add, edit, or delete product divisions under the 4 main categories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs rounded-xl transition flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Main Categories</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subcategory</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategories..."
            className="w-full text-xs pl-10 pr-4 py-2 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>
        <span className="text-xs text-zinc-400 font-medium">
          {filtered.length} Subcategories
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Subcategory Name</th>
                <th className="px-5 py-3.5">Slug URL</th>
                <th className="px-5 py-3.5">Parent Category</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-400">
                    No subcategories found. Click &quot;Add New Subcategory&quot; to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAFAFC] transition">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-[#081022]">{item.name}</p>
                      {item.description && (
                        <p className="text-[11px] text-zinc-400 truncate max-w-xs">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-500">/{item.slug}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F6851F] text-[10px] font-bold border border-orange-200">
                        {item.category_name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition cursor-pointer ${
                          item.is_active
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/products?category=${item.slug}`}
                          target="_blank"
                          title="View on Store"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-[#081022] hover:bg-zinc-100 transition"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          title="Edit Subcategory"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          title="Delete Subcategory"
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition cursor-pointer"
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

      {/* Add / Edit Subcategory Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 my-auto flex flex-col max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#F6851F]" />
                <h3 className="text-base font-bold">
                  {editingSubcat ? 'Edit Subcategory' : 'Add New Subcategory'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">
                  Parent Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => {
                    const sel = categories.find((c) => c.id === e.target.value)
                    setFormData({
                      ...formData,
                      category_id: e.target.value,
                      category_name: sel?.name || '',
                    })
                  }}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">
                  Subcategory Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    const val = e.target.value
                    const slug = val
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, '')
                      .replace(/[\s_-]+/g, '-')
                    setFormData({
                      ...formData,
                      name: val,
                      slug: editingSubcat ? formData.slug : slug,
                    })
                  }}
                  placeholder="e.g. Macintosh & Miller Blades"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">
                  Slug URL Identifier
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. macintosh-miller-blades"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief subcategory details..."
                  className="w-full text-xs p-3 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#081022]">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#F6851F] rounded"
                />
                <span>Active &amp; Visible in Store</span>
              </label>

              <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Subcategory</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
