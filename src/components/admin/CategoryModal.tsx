'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, FolderOpen } from 'lucide-react'
import { CategoryItem } from '@/src/types'
import { saveCategory } from '@/src/lib/dataStore'

interface CategoryModalProps {
  category: CategoryItem | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

export default function CategoryModal({ category, isOpen, onClose, onSaved }: CategoryModalProps) {
  const [formData, setFormData] = useState<Partial<CategoryItem>>({
    name: '',
    slug: '',
    description: '',
    image_url: '/images/transact/image5_3812_2.jpg',
    sort_order: 1,
    is_published: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (category) {
      setFormData({ ...category })
    } else {
      setFormData({
        id: `cat-${Date.now()}`,
        name: '',
        slug: '',
        description: '',
        image_url: '/images/transact/image5_3812_2.jpg',
        sort_order: 1,
        is_published: true,
      })
    }
  }, [category, isOpen])

  if (!isOpen) return null

  const handleNameChange = (val: string) => {
    const slug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
    setFormData((prev) => ({ ...prev, name: val, slug: category ? prev.slug : slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) return

    setIsSaving(true)
    try {
      const catToSave: CategoryItem = {
        id: formData.id || `cat-${Date.now()}`,
        name: formData.name,
        slug: formData.slug || `cat-${Date.now()}`,
        description: formData.description || null,
        image_url: formData.image_url || null,
        sort_order: Number(formData.sort_order) || 1,
        is_published: Boolean(formData.is_published),
      }

      await saveCategory(catToSave)
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#F6851F]" />
            <h3 className="text-base font-bold">
              {category ? 'Edit Category' : 'Add New Category'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Category Name *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Microsurgical Instruments"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Slug URL Identifier</label>
            <input
              type="text"
              required
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Image URL</label>
            <input
              type="text"
              value={formData.image_url || ''}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/images/transact/image5_3812_2.jpg"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief specialty description..."
              className="w-full text-xs p-3 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#081022]">
            <input
              type="checkbox"
              checked={Boolean(formData.is_published)}
              onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
              className="w-4 h-4 text-[#F6851F] rounded"
            />
            <span>Active & Visible in Store Menu</span>
          </label>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
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
              <span>{isSaving ? 'Saving...' : 'Save Category'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
