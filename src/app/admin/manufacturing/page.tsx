'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Eye,
  CheckCircle2,
  Sparkles,
  Factory,
  Layers,
  Image as ImageIcon,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { ManufacturingData } from '@/src/types'
import initialManufacturing from '@/src/data/manufacturing.json'

export default function AdminManufacturingPage() {
  const [data, setData] = useState<ManufacturingData>(initialManufacturing as unknown as ManufacturingData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveNotice, setSaveNotice] = useState('')
  const [activeTab, setActiveTab] = useState<'hero' | 'intro' | 'workflow' | 'production_steps' | 'standards' | 'cta'>('production_steps')

  // Available icon presets from the user's requested files
  const availableIcons = [
    { label: 'Quality Icon', path: '/quality-icon 1 (1).svg' },
    { label: 'Worker / Team', path: '/Worker-icon 2 (1).svg' },
    { label: 'Material', path: '/Material-icon 1 (1).svg' },
    { label: 'Finishing & Polishing', path: '/Finishing-Polishing-icon 1 (1).svg' },
    { label: 'Forging & Machining', path: '/Forging & Machining-icon 1 (1).svg' },
    { label: 'Global Presence', path: '/Global Presence-icon 2.svg' },
    { label: 'Global Icon', path: '/global-icon 2 (1).svg' },
    { label: 'Inspection Process', path: '/Inspection Process-icon 1.svg' },
    { label: 'Quality Control', path: '/Quality Control-icon 1.svg' },
    { label: 'Reusable Grade', path: '/reusable-grade 1.svg' },
    { label: 'Reliable', path: '/Reliable 1.svg' },
    { label: 'Skilled Craftsmanship', path: '/Skilled Craftsmanship-icon 1.svg' },
    { label: 'Packing & Sterilization', path: '/Packing & Sterilization-icon 1 (1).svg' },
    { label: 'Factory Orange', path: '/factory-orange.svg' },
  ]

  useEffect(() => {
    fetch('/api/manufacturing', { cache: 'no-store' })
      .then((r) => r.json())
      .then((res) => {
        if (res && res.hero) setData(res)
      })
      .catch(() => {})
  }, [])

  const showNotification = (msg: string) => {
    setSaveNotice(msg)
    setTimeout(() => setSaveNotice(''), 4000)
  }

  const handleSaveAll = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/manufacturing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        showNotification('Manufacturing Process Page changes saved live on disk! Every device will see the new updates.')
      } else {
        showNotification('Error saving changes.')
      }
    } catch (err) {
      console.error(err)
      showNotification('Network error while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  // Upload handler for any step photo or hero image
  const uploadImageFile = async (file: File): Promise<string | null> => {
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      })
      if (res.ok) {
        const d = await res.json()
        if (d.url) return d.url
      }
      return null
    } catch (err) {
      console.error(err)
      return null
    }
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <Factory className="w-6 h-6 text-[#F6851F]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
              Manufacturing Process Page Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Edit live process cards, photos, icons, and standards. All changes persist permanently on disk.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/production"
            target="_blank"
            className="px-4 py-2.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl text-xs font-bold text-zinc-700 shadow-xs transition flex items-center gap-1.5"
          >
            <Eye className="w-4 h-4 text-[#F6851F]" />
            <span>View Live Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </Link>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving to Server...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Save Notification Banner */}
      {saveNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200 pb-2">
        {[
          { key: 'production_steps', label: 'Photo Process Steps (Image 416)' },
          { key: 'workflow', label: 'Workflow Cards (6 Steps)' },
          { key: 'hero', label: 'Hero Section (Image 333)' },
          { key: 'intro', label: 'Intro & 4 Pillars' },
          { key: 'standards', label: 'Standards (Orange Cards)' },
          { key: 'cta', label: 'CTA Banner' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === tab.key
                ? 'bg-[#081022] text-white shadow-sm'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 1: PHOTO-RICH PROCESS STEPS (Sliced from Image 416)     */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'production_steps' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Photo Production Steps (Sliced Image 416)
                </h3>
                <p className="text-xs text-zinc-500">
                  Each step has its own image placeholder, step number, title, and description so you can edit, replace, add, or delete steps anytime.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newNum = String(data.production_steps.steps.length + 1).padStart(2, '0')
                  const newStep = {
                    id: `step-${Date.now()}`,
                    step: newNum,
                    title: 'New Production Process Step',
                    description: 'Description of the advanced precision manufacturing phase...',
                    image: '/images/manufacturing/step-1-cnc.png',
                  }
                  setData((prev) => ({
                    ...prev,
                    production_steps: {
                      ...prev.production_steps,
                      steps: [...prev.production_steps.steps, newStep],
                    },
                  }))
                }}
                className="px-4 py-2 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Process Step</span>
              </button>
            </div>

            {/* Section Headings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Section Tagline</label>
                <input
                  type="text"
                  value={data.production_steps.tagline || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      production_steps: { ...prev.production_steps, tagline: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={data.production_steps.heading || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      production_steps: { ...prev.production_steps, heading: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Counter Label</label>
                <input
                  type="text"
                  value={data.production_steps.counter || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      production_steps: { ...prev.production_steps, counter: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Section Description</label>
              <textarea
                rows={2}
                value={data.production_steps.description || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    production_steps: { ...prev.production_steps, description: e.target.value },
                  }))
                }
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
          </div>

          {/* List of Sliced Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.production_steps.steps.map((st, idx) => (
              <div
                key={st.id || idx}
                className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-[#F6851F]">
                    Step #{idx + 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...data.production_steps.steps]
                        const temp = copy[idx - 1]
                        copy[idx - 1] = copy[idx]
                        copy[idx] = temp
                        setData((prev) => ({
                          ...prev,
                          production_steps: { ...prev.production_steps, steps: copy },
                        }))
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.production_steps.steps.length - 1}
                      onClick={() => {
                        const copy = [...data.production_steps.steps]
                        const temp = copy[idx + 1]
                        copy[idx + 1] = copy[idx]
                        copy[idx] = temp
                        setData((prev) => ({
                          ...prev,
                          production_steps: { ...prev.production_steps, steps: copy },
                        }))
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm(`Delete process step "${st.title}"?`)) return
                        const copy = data.production_steps.steps.filter((_, i) => i !== idx)
                        setData((prev) => ({
                          ...prev,
                          production_steps: { ...prev.production_steps, steps: copy },
                        }))
                      }}
                      className="p-1 text-red-500 hover:text-red-700 rounded ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Image Placeholder & Upload Area */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    Step Photo Placeholder & Upload
                  </label>
                  <div className="relative group w-full h-40 rounded-2xl bg-slate-900 overflow-hidden border border-zinc-200 flex items-center justify-center">
                    <Image
                      src={st.image}
                      alt={st.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />

                    {/* Overlay Upload Button */}
                    <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                      <UploadCloud className="w-6 h-6 mb-1 text-[#F6851F]" />
                      <span className="text-xs font-bold">Upload New Photo</span>
                      <span className="text-[10px] text-zinc-300">PNG, JPG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            const newUrl = await uploadImageFile(e.target.files[0])
                            if (newUrl) {
                              const copy = [...data.production_steps.steps]
                              copy[idx].image = newUrl
                              setData((prev) => ({
                                ...prev,
                                production_steps: { ...prev.production_steps, steps: copy },
                              }))
                              showNotification(`Photo updated for "${st.title}"`)
                            }
                          }
                        }}
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={st.image}
                    onChange={(e) => {
                      const copy = [...data.production_steps.steps]
                      copy[idx].image = e.target.value
                      setData((prev) => ({
                        ...prev,
                        production_steps: { ...prev.production_steps, steps: copy },
                      }))
                    }}
                    placeholder="/images/manufacturing/step-1-cnc.png"
                    className="w-full text-[11px] px-3 py-1.5 mt-1.5 rounded-lg bg-zinc-50 border border-zinc-200 font-mono text-zinc-600"
                  />
                </div>

                {/* Step Text Fields */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Step #</label>
                    <input
                      type="text"
                      value={st.step}
                      onChange={(e) => {
                        const copy = [...data.production_steps.steps]
                        copy[idx].step = e.target.value
                        setData((prev) => ({
                          ...prev,
                          production_steps: { ...prev.production_steps, steps: copy },
                        }))
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-[#F6851F]"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => {
                        const copy = [...data.production_steps.steps]
                        copy[idx].title = e.target.value
                        setData((prev) => ({
                          ...prev,
                          production_steps: { ...prev.production_steps, steps: copy },
                        }))
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={st.description}
                    onChange={(e) => {
                      const copy = [...data.production_steps.steps]
                      copy[idx].description = e.target.value
                      setData((prev) => ({
                        ...prev,
                        production_steps: { ...prev.production_steps, steps: copy },
                      }))
                    }}
                    className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 2: WORKFLOW PROCESS CARDS (6 Steps)                     */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900">
                  Workflow Process Cards (6 Cards Grid)
                </h3>
                <p className="text-xs text-zinc-500">
                  Manage the 6 core stages: Requirement Review, Material Selection, Forging, CNC, Assembly, Inspection.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newNum = String(data.workflow.cards.length + 1).padStart(2, '0')
                  const newCard = {
                    id: `wf-${Date.now()}`,
                    step: newNum,
                    title: 'New Workflow Phase',
                    description: 'Details of the precision production protocol...',
                    icon: '/quality-icon 1 (1).svg',
                  }
                  setData((prev) => ({
                    ...prev,
                    workflow: { ...prev.workflow, cards: [...prev.workflow.cards, newCard] },
                  }))
                }}
                className="px-4 py-2 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add Workflow Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Section Tagline</label>
                <input
                  type="text"
                  value={data.workflow.tagline || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      workflow: { ...prev.workflow, tagline: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={data.workflow.heading || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      workflow: { ...prev.workflow, heading: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Subheading</label>
              <textarea
                rows={2}
                value={data.workflow.subheading || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    workflow: { ...prev.workflow, subheading: e.target.value },
                  }))
                }
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.workflow.cards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-[#F6851F]">
                    Step {card.step}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const copy = [...data.workflow.cards]
                        const temp = copy[idx - 1]
                        copy[idx - 1] = copy[idx]
                        copy[idx] = temp
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === data.workflow.cards.length - 1}
                      onClick={() => {
                        const copy = [...data.workflow.cards]
                        const temp = copy[idx + 1]
                        copy[idx + 1] = copy[idx]
                        copy[idx] = temp
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="p-1 text-zinc-400 hover:text-zinc-700 disabled:opacity-30 rounded"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm(`Delete card "${card.title}"?`)) return
                        const copy = data.workflow.cards.filter((_, i) => i !== idx)
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="p-1 text-red-500 hover:text-red-700 rounded ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                    Card Icon Selection
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/30 flex items-center justify-center p-2 shrink-0">
                      <Image
                        src={card.icon}
                        alt="icon preview"
                        width={28}
                        height={28}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <select
                      value={card.icon}
                      onChange={(e) => {
                        const copy = [...data.workflow.cards]
                        copy[idx].icon = e.target.value
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="flex-1 text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200"
                    >
                      {availableIcons.map((ic) => (
                        <option key={ic.path} value={ic.path}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Step</label>
                    <input
                      type="text"
                      value={card.step}
                      onChange={(e) => {
                        const copy = [...data.workflow.cards]
                        copy[idx].step = e.target.value
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[11px] font-bold text-zinc-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => {
                        const copy = [...data.workflow.cards]
                        copy[idx].title = e.target.value
                        setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-bold text-[#F6851F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-zinc-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={card.description}
                    onChange={(e) => {
                      const copy = [...data.workflow.cards]
                      copy[idx].description = e.target.value
                      setData((prev) => ({ ...prev, workflow: { ...prev.workflow, cards: copy } }))
                    }}
                    className="w-full text-xs p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 3: HERO SECTION (Image 333)                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-6">
          <div className="border-b border-zinc-100 pb-3">
            <h3 className="text-base font-bold text-zinc-900">Hero Section (Dark Navy)</h3>
            <p className="text-xs text-zinc-500">
              Customize title, subtitle, badge tag, and hero laryngoscope image.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={data.hero.badge || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, badge: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Hero Title</label>
                <input
                  type="text"
                  value={data.hero.title || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Subtitle</label>
                <textarea
                  rows={3}
                  value={data.hero.subtitle || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value },
                    }))
                  }
                  className="w-full text-xs p-3 rounded-xl bg-zinc-50 border border-zinc-200"
                />
              </div>
            </div>

            {/* Hero Image Upload Dropzone */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-700">
                Hero Image Placeholder & Upload
              </label>
              <div className="relative group w-full h-56 rounded-2xl bg-[#081022] overflow-hidden border border-zinc-300 flex items-center justify-center p-4">
                <Image
                  src={data.hero.hero_image || '/image 333.svg'}
                  alt="Hero Preview"
                  fill
                  unoptimized
                  className="object-contain p-2"
                />
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                  <UploadCloud className="w-8 h-8 text-[#F6851F] mb-1" />
                  <span className="text-xs font-bold">Upload New Hero Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const newUrl = await uploadImageFile(e.target.files[0])
                        if (newUrl) {
                          setData((prev) => ({
                            ...prev,
                            hero: { ...prev.hero, hero_image: newUrl },
                          }))
                          showNotification('Hero image updated!')
                        }
                      }
                    }}
                  />
                </label>
              </div>
              <input
                type="text"
                value={data.hero.hero_image || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    hero: { ...prev.hero, hero_image: e.target.value },
                  }))
                }
                placeholder="/image 333.svg"
                className="w-full text-[11px] px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 4: INTRO & 4 PILLARS                                    */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'intro' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              Section 1: Intro & Quality Solutions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={data.intro.tagline || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      intro: { ...prev.intro, tagline: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={data.intro.heading || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      intro: { ...prev.intro, heading: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Description Paragraph</label>
              <textarea
                rows={3}
                value={data.intro.description || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    intro: { ...prev.intro, description: e.target.value },
                  }))
                }
                className="w-full text-xs p-3 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              4 Feature Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.intro.pillars.map((pil, idx) => (
                <div key={pil.id || idx} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] border border-[#F6851F]/30 flex items-center justify-center p-1.5 shrink-0">
                      <Image
                        src={pil.icon}
                        alt="icon"
                        width={24}
                        height={24}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                    <select
                      value={pil.icon}
                      onChange={(e) => {
                        const copy = [...data.intro.pillars]
                        copy[idx].icon = e.target.value
                        setData((prev) => ({ ...prev, intro: { ...prev.intro, pillars: copy } }))
                      }}
                      className="flex-1 text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200"
                    >
                      {availableIcons.map((ic) => (
                        <option key={ic.path} value={ic.path}>
                          {ic.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={pil.title}
                        onChange={(e) => {
                          const copy = [...data.intro.pillars]
                          copy[idx].title = e.target.value
                          setData((prev) => ({ ...prev, intro: { ...prev.intro, pillars: copy } }))
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-600 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={pil.subtitle}
                        onChange={(e) => {
                          const copy = [...data.intro.pillars]
                          copy[idx].subtitle = e.target.value
                          setData((prev) => ({ ...prev, intro: { ...prev.intro, pillars: copy } }))
                        }}
                        className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 text-[#F6851F]"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 5: STANDARDS (Orange Glass Cards)                       */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'standards' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
              The Transact Medical Standard (Orange Section)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={data.standards.tagline || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      standards: { ...prev.standards, tagline: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Heading</label>
                <input
                  type="text"
                  value={data.standards.heading || ''}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      standards: { ...prev.standards, heading: e.target.value },
                    }))
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.standards.cards.map((std, idx) => (
              <div key={std.id || idx} className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-white text-[#F6851F] border border-orange-300">
                    Standard #{std.step}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-bold text-zinc-700 mb-1">Step</label>
                    <input
                      type="text"
                      value={std.step}
                      onChange={(e) => {
                        const copy = [...data.standards.cards]
                        copy[idx].step = e.target.value
                        setData((prev) => ({ ...prev, standards: { ...prev.standards, cards: copy } }))
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-zinc-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={std.title}
                      onChange={(e) => {
                        const copy = [...data.standards.cards]
                        copy[idx].title = e.target.value
                        setData((prev) => ({ ...prev, standards: { ...prev.standards, cards: copy } }))
                      }}
                      className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-white border border-zinc-200 font-bold uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={std.description}
                    onChange={(e) => {
                      const copy = [...data.standards.cards]
                      copy[idx].description = e.target.value
                      setData((prev) => ({ ...prev, standards: { ...prev.standards, cards: copy } }))
                    }}
                    className="w-full text-xs p-2.5 rounded-lg bg-white border border-zinc-200 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* TAB 6: CTA BANNER                                           */}
      {/* ─────────────────────────────────────────────────────────── */}
      {activeTab === 'cta' && (
        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
            Bottom CTA Banner
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Tagline</label>
              <input
                type="text"
                value={data.cta.tagline || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, tagline: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Heading Prefix</label>
              <input
                type="text"
                value={data.cta.heading || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, heading: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Highlight Text (Orange)</label>
              <input
                type="text"
                value={data.cta.highlight || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, highlight: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-[#F6851F] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Description</label>
              <input
                type="text"
                value={data.cta.description || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, description: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Email Button Text</label>
              <input
                type="text"
                value={data.cta.email_text || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, email_text: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Email Link</label>
              <input
                type="text"
                value={data.cta.email_link || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, email_link: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">WhatsApp Button Text</label>
              <input
                type="text"
                value={data.cta.whatsapp_text || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, whatsapp_text: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">WhatsApp Link</label>
              <input
                type="text"
                value={data.cta.whatsapp_link || ''}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    cta: { ...prev.cta, whatsapp_link: e.target.value },
                  }))
                }
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
