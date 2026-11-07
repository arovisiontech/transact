'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Save, FolderOpen, UploadCloud, Image as ImageIcon, Loader2, Link2 } from 'lucide-react'
import { toast } from 'sonner'
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
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = async (file: File) => {
    if (!file) return
    setIsUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'images/uploads')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })

      if (res.ok) {
        const data = await res.json()
        if (data.url) {
          setFormData((prev) => ({ ...prev, image_url: data.url, card_image: data.url }))
          setIsUploading(false)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setFormData((prev) => ({ ...prev, image_url: b64, card_image: b64 }))
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setFormData((prev) => ({ ...prev, image_url: b64, card_image: b64 }))
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
    if (!formData.name?.trim()) {
      toast.error('Category name is required')
      return
    }

    setIsSaving(true)
    try {
      const catToSave: CategoryItem = {
        id: formData.id || `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug: formData.slug?.trim() || `cat-${Date.now()}`,
        description: formData.description || null,
        image_url: formData.image_url || null,
        card_image: formData.image_url || null,
        sort_order: Number(formData.sort_order) || 1,
        is_published: Boolean(formData.is_published),
        section: formData.section || 'airway',
        section_label:
          formData.section === 'diagnostics'
            ? 'Section 2: Diagnostics & Otoscopy (SS 5)'
            : 'Section 1: Airway Management (SS 2)',
      }

      await saveCategory(catToSave)
      toast.success(category ? 'Category updated successfully!' : 'Category created successfully!')
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save category')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 my-auto flex flex-col max-h-[90vh] overflow-hidden">
        {/* Sticky Header */}
        <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-[#F6851F]" />
            <h3 className="text-base font-bold">
              {category ? 'Edit Category' : 'Add New Category'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* ── Section Placement Selector (SS 2 vs SS 5) ── */}
          <div className="space-y-1.5 pb-1">
            <label className="block text-xs font-bold text-[#081022]">
              Homepage Showcase Placement *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    section: 'airway',
                    section_label: 'Section 1: Airway Management (SS 2)',
                  }))
                }
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  formData.section !== 'diagnostics'
                    ? 'border-[#F6851F] bg-orange-50/60 ring-2 ring-[#F6851F]/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold text-[#081022]">Section 1: Airway</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Laryngoscopes Showcase (SS 2)</div>
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    section: 'diagnostics',
                    section_label: 'Section 2: Diagnostics & Otoscopy (SS 5)',
                  }))
                }
                className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                  formData.section === 'diagnostics'
                    ? 'border-[#F6851F] bg-orange-50/60 ring-2 ring-[#F6851F]/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                <div className="text-xs font-bold text-[#081022]">Section 2: Diagnostics</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Otoscopy Showcase (SS 5)</div>
              </button>
            </div>
          </div>

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

          {/* ── Category Image Placeholder & Direct Upload ── */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-[#081022] uppercase tracking-wide">
                  Category Image &amp; Placeholder
                </label>
                <p className="text-[11px] text-slate-500">
                  Upload an image directly from your device/gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="text-xs text-[#F6851F] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Link2 className="w-3 h-3" />
                {showUrlInput ? 'Hide URL' : 'Enter URL'}
              </button>
            </div>

            {showUrlInput && (
              <input
                type="text"
                placeholder="https://... or /images/..."
                value={formData.image_url || ''}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-4 relative aspect-[4/3] rounded-xl bg-white border-2 border-dashed border-zinc-300 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                {formData.image_url ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={formData.image_url}
                      alt="Category preview"
                      fill
                      unoptimized
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-center p-2 text-zinc-400">
                    <ImageIcon className="w-6 h-6 mx-auto mb-1 stroke-1" />
                    <span className="text-[10px] font-medium">No Image</span>
                  </div>
                )}
              </div>

              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragOver(true)
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`sm:col-span-8 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px] ${
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

                <div className="w-8 h-8 rounded-full bg-[#F6851F]/10 flex items-center justify-center text-[#F6851F] mb-1">
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                </div>
                <p className="text-xs font-bold text-zinc-800">
                  {isUploading ? 'Uploading Image...' : 'Click or Drag & Drop Category Image'}
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">PNG, JPG, SVG, WebP from Gallery</p>
              </div>
            </div>
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

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white/95 backdrop-blur-sm py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer"
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
