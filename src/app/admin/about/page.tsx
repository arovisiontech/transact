'use client'

import React, { useState, useEffect } from 'react'
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  Globe,
  Award,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react'
import initialAboutData from '@/src/data/about.json'

export default function AdminAboutPage() {
  const [data, setData] = useState<any>(initialAboutData)
  const [loading, setLoading] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/about', { cache: 'no-store' })
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then((live) => {
        if (live && live.hero) setData(live)
      })
      .catch((e) => console.warn('Admin about load error:', e))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    setSavedSuccess(false)
    try {
      const res = await fetch('/api/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 4000)
      } else {
        alert('Failed to save changes. Please try again.')
      }
    } catch (e: any) {
      alert('Error saving: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const updateMilestone = (idx: number, field: string, value: string) => {
    setData((prev: any) => {
      const milestones = [...prev.timeline.milestones]
      milestones[idx] = { ...milestones[idx], [field]: value }
      return {
        ...prev,
        timeline: { ...prev.timeline, milestones },
      }
    })
  }

  const addMilestone = () => {
    setData((prev: any) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: [
          ...prev.timeline.milestones,
          { year: '2025', title: 'New Achievement', description: 'Description of milestone...' },
        ],
      },
    }))
  }

  const deleteMilestone = (idx: number) => {
    setData((prev: any) => ({
      ...prev,
      timeline: {
        ...prev.timeline,
        milestones: prev.timeline.milestones.filter((_: any, i: number) => i !== idx),
      },
    }))
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <span className="text-xs font-bold text-[#F6851F] uppercase tracking-wider block">
            CMS Content Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022] tracking-tight mt-1">
            About Us Page Control
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Edit text, manufacturing narrative, timeline, and certifications. Changes are instantly saved to disk and visible across all devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" /> Live Changes Saved!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07312] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Changes</span>
          </button>
        </div>
      </div>

      {/* 1. Hero Section Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <Sparkles className="w-5 h-5 text-[#F6851F]" />
          <h2 className="text-lg font-bold text-[#081022]">1. Hero Section</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Tagline (Top Text)
            </label>
            <input
              type="text"
              value={data.hero?.tagline || ''}
              onChange={(e) => updateField('hero', 'tagline', e.target.value)}
              placeholder="We Love Laryngoscope & Diagnostic"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Image URL / Path
            </label>
            <input
              type="text"
              value={data.hero?.image_url || ''}
              onChange={(e) => updateField('hero', 'image_url', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Title Line 1
            </label>
            <input
              type="text"
              value={data.hero?.title_line1 || ''}
              onChange={(e) => updateField('hero', 'title_line1', e.target.value)}
              placeholder="Since 1990"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Title Line 2
            </label>
            <input
              type="text"
              value={data.hero?.title_line2 || ''}
              onChange={(e) => updateField('hero', 'title_line2', e.target.value)}
              placeholder="Inspired By Life"
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>
      </div>

      {/* 2. Story Narrative Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <Info className="w-5 h-5 text-[#F6851F]" />
          <h2 className="text-lg font-bold text-[#081022]">2. Engineering Story & Narrative</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Badge Text
            </label>
            <input
              type="text"
              value={data.story?.badge || ''}
              onChange={(e) => updateField('story', 'badge', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Left Column Paragraph 1
            </label>
            <textarea
              rows={3}
              value={data.story?.left_p1 || ''}
              onChange={(e) => updateField('story', 'left_p1', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Right Column Paragraph 1
            </label>
            <textarea
              rows={3}
              value={data.story?.right_p1 || ''}
              onChange={(e) => updateField('story', 'right_p1', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Left Column Paragraph 2
            </label>
            <textarea
              rows={3}
              value={data.story?.left_p2 || ''}
              onChange={(e) => updateField('story', 'left_p2', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">
              Right Column Paragraph 2
            </label>
            <textarea
              rows={3}
              value={data.story?.right_p2 || ''}
              onChange={(e) => updateField('story', 'right_p2', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>
      </div>

      {/* 3. Timeline Milestones Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#F6851F]" />
            <h2 className="text-lg font-bold text-[#081022]">3. Where It All Began (Milestones)</h2>
          </div>
          <button
            onClick={addMilestone}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 text-[#F6851F] hover:bg-orange-100 font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add Milestone
          </button>
        </div>

        <div className="space-y-4">
          {data.timeline?.milestones?.map((m: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFC] relative space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F6851F]">Milestone #{idx + 1}</span>
                <button
                  onClick={() => deleteMilestone(idx)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4B5D71] mb-1">Year</label>
                  <input
                    type="text"
                    value={m.year}
                    onChange={(e) => updateMilestone(idx, 'year', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#4B5D71] mb-1">Title</label>
                  <input
                    type="text"
                    value={m.title}
                    onChange={(e) => updateMilestone(idx, 'title', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs font-bold"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-[#4B5D71] mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={m.description}
                    onChange={(e) => updateMilestone(idx, 'description', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 text-xs"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Global Manufacturing Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <Globe className="w-5 h-5 text-[#F6851F]" />
          <h2 className="text-lg font-bold text-[#081022]">4. Global Manufacturing Section</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Badge Text</label>
            <input
              type="text"
              value={data.manufacturing?.badge || ''}
              onChange={(e) => updateField('manufacturing', 'badge', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Section Title</label>
            <input
              type="text"
              value={data.manufacturing?.title || ''}
              onChange={(e) => updateField('manufacturing', 'title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Description</label>
            <textarea
              rows={3}
              value={data.manufacturing?.description || ''}
              onChange={(e) => updateField('manufacturing', 'description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">World Map Vector Graphic</label>
            <input
              type="text"
              value={data.manufacturing?.map_image || ''}
              onChange={(e) => updateField('manufacturing', 'map_image', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </div>
        </div>
      </div>

      {/* 5. Regulatory Standards Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <Award className="w-5 h-5 text-[#F6851F]" />
          <h2 className="text-lg font-bold text-[#081022]">5. Regulatory Standards (Commitment To Excellence)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Title Line 1</label>
            <input
              type="text"
              value={data.standards?.title_line1 || ''}
              onChange={(e) => updateField('standards', 'title_line1', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Title Line 2 (Highlighted)</label>
            <input
              type="text"
              value={data.standards?.title_line2 || ''}
              onChange={(e) => updateField('standards', 'title_line2', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Description</label>
            <textarea
              rows={2}
              value={data.standards?.description || ''}
              onChange={(e) => updateField('standards', 'description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* 5 Standards Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {data.standards?.items?.map((item: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFC] space-y-2.5">
              <span className="text-xs font-black text-[#F6851F] uppercase">{item.code} Standard</span>
              <input
                type="text"
                value={item.title}
                onChange={(e) => {
                  const items = [...data.standards.items]
                  items[idx].title = e.target.value
                  updateField('standards', 'items', items)
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold"
              />
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const items = [...data.standards.items]
                  items[idx].description = e.target.value
                  updateField('standards', 'items', items)
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Product Line Categories Form */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-100">
          <Layers className="w-5 h-5 text-[#F6851F]" />
          <h2 className="text-lg font-bold text-[#081022]">6. Discover Our Product Line (Bottom Categories)</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Section Title</label>
            <input
              type="text"
              value={data.productLine?.title || ''}
              onChange={(e) => updateField('productLine', 'title', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4B5D71] uppercase mb-1.5">Subtitle</label>
            <input
              type="text"
              value={data.productLine?.subtitle || ''}
              onChange={(e) => updateField('productLine', 'subtitle', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs sm:text-sm font-medium"
            />
          </div>
        </div>

        {/* 4 Category Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {data.productLine?.categories?.map((cat: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl border border-zinc-200 bg-[#FAFAFC] space-y-2.5">
              <span className="text-xs font-black text-[#F6851F]">Category #{idx + 1}</span>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Name</label>
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const categories = [...data.productLine.categories]
                    categories[idx].name = e.target.value
                    updateField('productLine', 'categories', categories)
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Image</label>
                <input
                  type="text"
                  value={cat.image}
                  onChange={(e) => {
                    const categories = [...data.productLine.categories]
                    categories[idx].image = e.target.value
                    updateField('productLine', 'categories', categories)
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Link</label>
                <input
                  type="text"
                  value={cat.link}
                  onChange={(e) => {
                    const categories = [...data.productLine.categories]
                    categories[idx].link = e.target.value
                    updateField('productLine', 'categories', categories)
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[#F6851F] hover:bg-[#E07312] text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save All Changes Live</span>
        </button>
      </div>
    </div>
  )
}
