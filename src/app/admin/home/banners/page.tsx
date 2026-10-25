'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Sparkles,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'
import { BannerItem } from '@/src/types'
import {
  getStoredBanners,
  saveBanner,
  deleteBanner,
  moveBannerOrder,
} from '@/src/lib/dataStore'

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null)

  const [formData, setFormData] = useState<BannerItem>({
    id: '',
    title: '',
    subtitle: '',
    image_url: '/images/transact/image3_3812_2.jpg',
    link_url: '/categories',
    position: 'top',
    is_active: true,
    sort_order: 1,
  })

  const loadBanners = () => {
    const list = getStoredBanners()
    setBanners([...list].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)))
  }

  useEffect(() => {
    loadBanners()
    const handleUpdate = () => loadBanners()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const handleOpenAdd = () => {
    setEditingBanner(null)
    setFormData({
      id: `banner-${Date.now()}`,
      title: '',
      subtitle: '',
      image_url: '/images/transact/image3_3812_2.jpg',
      link_url: '/categories',
      position: 'top',
      is_active: true,
      sort_order: banners.length + 1,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (banner: BannerItem) => {
    setEditingBanner(banner)
    setFormData({ ...banner })
    setIsModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Banner title is required')
      return
    }

    saveBanner(formData)
    toast.success(editingBanner ? 'Banner updated!' : 'New banner created!')
    setIsModalOpen(false)
    loadBanners()
  }

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete banner "${title}"?`)) {
      deleteBanner(id)
      toast.success('Banner removed')
      loadBanners()
    }
  }

  const handleMove = (id: string, direction: 'up' | 'down') => {
    const updated = moveBannerOrder(id, direction)
    setBanners(updated)
    toast.success(`Banner moved ${direction}`)
  }

  const handleToggleActive = (banner: BannerItem) => {
    const updated = { ...banner, is_active: !banner.is_active }
    saveBanner(updated)
    toast.success(`Banner is now ${updated.is_active ? 'Active' : 'Draft'}`)
    loadBanners()
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <Sparkles className="w-4 h-4" />
            <span>Storefront Marketing</span>
          </div>
          <h1 className="text-2xl font-black text-[#081022] mt-1">Promotional Banners</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure featured banners across home page sections and promotional announcements.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {banners.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">
            <Sparkles className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <p className="font-semibold text-zinc-600">No Banners Found</p>
            <p className="text-xs text-zinc-400 mt-1">Create marketing banners to showcase new instrument series.</p>
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:border-[#F6851F]/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 relative shrink-0">
                  <Image
                    src={banner.image_url || '/images/transact/image3_3812_2.jpg'}
                    alt={banner.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                      Pos: {banner.position || 'Standard'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-[#081022] leading-snug">{banner.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">{banner.subtitle}</p>
                  {banner.link_url && (
                    <div className="flex items-center gap-1 text-[11px] text-[#F6851F] pt-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>{banner.link_url}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end md:self-center">
                <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                  <button
                    onClick={() => handleMove(banner.id, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 transition cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(banner.id, 'down')}
                    disabled={index === banners.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 transition cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => handleToggleActive(banner)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    banner.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {banner.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{banner.is_active ? 'Active' : 'Draft'}</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="p-2 rounded-xl text-zinc-600 hover:text-[#081022] hover:bg-zinc-100 border border-zinc-200 transition cursor-pointer"
                  title="Edit Banner"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(banner.id, banner.title)}
                  className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-100 my-8">
            <h2 className="text-xl font-black text-[#081022] mb-1">
              {editingBanner ? 'Edit Banner' : 'Create New Promotional Banner'}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Enter promotional headline, graphic background, and action redirect link.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Banner Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Precision Surgical Forceps Special Line"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Subtitle / Details</label>
                <input
                  type="text"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="German Stainless Steel Grade AISI 420..."
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Target Link</label>
                  <input
                    type="text"
                    value={formData.link_url || ''}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="/categories/general-surgery"
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Position</label>
                  <select
                    value={formData.position || 'top'}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none bg-white"
                  >
                    <option value="top">Top Header Banner</option>
                    <option value="middle">Mid-Page Feature</option>
                    <option value="footer">Bottom Callout</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded text-[#F6851F] focus:ring-[#F6851F]"
                  />
                  <span className="text-xs font-bold text-zinc-700">Display banner actively</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
