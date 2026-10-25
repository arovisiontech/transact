'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Sliders,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { toast } from 'sonner'
import { HeroSlideItem } from '@/src/types'
import {
  getStoredHeroSlides,
  saveHeroSlide,
  deleteHeroSlide,
  moveHeroSlideOrder,
} from '@/src/lib/dataStore'

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlideItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlideItem | null>(null)

  // Form state
  const [formData, setFormData] = useState<HeroSlideItem>({
    id: '',
    title: '',
    subtitle: '',
    badge: 'ISO 13485:2016 CERTIFIED',
    image: '/images/transact/image0_3812_2.png',
    primaryCtaText: 'Request Quotation',
    primaryCtaLink: '/contact',
    secondaryCtaText: 'Browse Catalogues',
    secondaryCtaLink: '/catalogues',
    sort_order: 1,
    is_active: true,
  })

  const loadSlides = () => {
    const list = getStoredHeroSlides()
    setSlides([...list].sort((a, b) => a.sort_order - b.sort_order))
  }

  useEffect(() => {
    loadSlides()
    const handleUpdate = () => loadSlides()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const handleOpenAdd = () => {
    setEditingSlide(null)
    setFormData({
      id: `slide-${Date.now()}`,
      title: '',
      subtitle: '',
      badge: 'ISO 13485:2016 CERTIFIED',
      image: '/images/transact/image0_3812_2.png',
      primaryCtaText: 'Request Quotation',
      primaryCtaLink: '/contact',
      secondaryCtaText: 'Browse Catalogues',
      secondaryCtaLink: '/catalogues',
      sort_order: slides.length + 1,
      is_active: true,
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (slide: HeroSlideItem) => {
    setEditingSlide(slide)
    setFormData({ ...slide })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) {
      toast.error('Slide title is required')
      return
    }

    await saveHeroSlide(formData)
    toast.success(editingSlide ? 'Slide updated successfully!' : 'New slide added!')
    setIsModalOpen(false)
    loadSlides()
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete slide "${title}"?`)) {
      await deleteHeroSlide(id)
      toast.success('Slide removed')
      loadSlides()
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const updated = await moveHeroSlideOrder(id, direction)
    setSlides(updated)
    toast.success(`Slide moved ${direction}`)
  }

  const handleToggleActive = async (slide: HeroSlideItem) => {
    const updated = { ...slide, is_active: !slide.is_active }
    await saveHeroSlide(updated)
    toast.success(`Slide is now ${updated.is_active ? 'Active' : 'Draft'}`)
    loadSlides()
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <Sliders className="w-4 h-4" />
            <span>Storefront Visuals</span>
          </div>
          <h1 className="text-2xl font-black text-[#081022] mt-1">Hero Carousel Slides</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage the hero banner slides, headings, badge tags, and CTAs displayed on the home page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Slide Items List */}
      <div className="space-y-4">
        {slides.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">
            <Sliders className="w-12 h-12 mx-auto text-zinc-300 mb-3" />
            <p className="font-semibold text-zinc-600">No Hero Slides Configured</p>
            <p className="text-xs text-zinc-400 mt-1">Click &quot;Add New Slide&quot; to create your first visual.</p>
          </div>
        ) : (
          slides.map((slide, index) => (
            <div
              key={slide.id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:border-[#F6851F]/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4 flex-1">
                {/* Visual Thumbnail */}
                <div className="w-24 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 relative shrink-0">
                  <Image
                    src={slide.image || '/images/transact/image0_3812_2.png'}
                    alt={slide.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    #{index + 1}
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-1">
                  {slide.badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#F6851F] bg-[#FFF4EB] px-2 py-0.5 rounded-full border border-[#F6851F]/20">
                      <Sparkles className="w-2.5 h-2.5" />
                      {slide.badge}
                    </span>
                  )}
                  <h3 className="text-base font-black text-[#081022] leading-snug">{slide.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-1">{slide.subtitle}</p>
                  <div className="flex items-center gap-3 text-[11px] text-zinc-400 pt-1">
                    <span>
                      CTA: <strong className="text-zinc-700">{slide.primaryCtaText}</strong> ({slide.primaryCtaLink})
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {/* Move Up / Down */}
                <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                  <button
                    onClick={() => handleMove(slide.id, 'up')}
                    disabled={index === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Active Toggle */}
                <button
                  onClick={() => handleToggleActive(slide)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    slide.is_active
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                      : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                  }`}
                >
                  {slide.is_active ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  <span>{slide.is_active ? 'Active' : 'Draft'}</span>
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="p-2 rounded-xl text-zinc-600 hover:text-[#081022] hover:bg-zinc-100 border border-zinc-200 transition cursor-pointer"
                  title="Edit Slide"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(slide.id, slide.title)}
                  className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition cursor-pointer"
                  title="Delete Slide"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-100 my-8">
            <h2 className="text-xl font-black text-[#081022] mb-1">
              {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Configure text, badge, hero visual asset, and action links.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="e.g. ISO 13485:2016 CERTIFIED SURGICAL EXCELLENCE"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Slide Heading <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Precision Crafted Surgical & Medical Instruments"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Subtitle / Summary</label>
                <textarea
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Engineering high-grade stainless steel surgical solutions..."
                  className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Slide Image Path or URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/transact/image0_3812_2.png or SVG"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Video Stream / MP4 URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.video_url || ''}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://.../video.mp4 (e.g. Supabase storage video)"
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Primary CTA Button</label>
                  <input
                    type="text"
                    value={formData.primaryCtaText}
                    onChange={(e) => setFormData({ ...formData, primaryCtaText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Primary CTA Link</label>
                  <input
                    type="text"
                    value={formData.primaryCtaLink}
                    onChange={(e) => setFormData({ ...formData, primaryCtaLink: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Secondary CTA Button</label>
                  <input
                    type="text"
                    value={formData.secondaryCtaText || ''}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaText: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Secondary CTA Link</label>
                  <input
                    type="text"
                    value={formData.secondaryCtaLink || ''}
                    onChange={(e) => setFormData({ ...formData, secondaryCtaLink: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
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
                  <span className="text-xs font-bold text-zinc-700">Display this slide immediately (Active)</span>
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
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
