'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  Layers,
  Save,
  CheckCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStoredProductLine,
  saveProductLine,
  getStoredProjectDev,
  saveProjectDev,
  getStoredPrecisionMfg,
  savePrecisionMfg,
} from '@/src/lib/dataStore'
import {
  ProductLineShowcase,
  ProjectDevelopmentSection,
  PrecisionManufacturingSection,
} from '@/src/types'

export default function AdminProductLinePage() {
  const [activeTab, setActiveTab] = useState<'productLine' | 'projectDev' | 'precisionMfg'>('productLine')

  // Product Line Showcase State
  const [productLine, setProductLine] = useState<ProductLineShowcase>(getStoredProductLine())

  // Project Development State
  const [projectDev, setProjectDev] = useState<ProjectDevelopmentSection>(getStoredProjectDev())

  // Precision Manufacturing State
  const [precisionMfg, setPrecisionMfg] = useState<PrecisionManufacturingSection>(getStoredPrecisionMfg())

  const reloadData = () => {
    setProductLine(getStoredProductLine())
    setProjectDev(getStoredProjectDev())
    setPrecisionMfg(getStoredPrecisionMfg())
  }

  useEffect(() => {
    reloadData()
  }, [])

  const handleSaveProductLine = (e: React.FormEvent) => {
    e.preventDefault()
    saveProductLine(productLine)
    toast.success('Complete Product Line showcase updated successfully!')
  }

  const handleSaveProjectDev = (e: React.FormEvent) => {
    e.preventDefault()
    saveProjectDev(projectDev)
    toast.success('New Products Project Development section updated successfully!')
  }

  const handleResetProductLine = () => {
    const defaults: ProductLineShowcase = {
      title: 'Our Complete Product Line',
      subtitle:
        'Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management.\nImages Are For Illustrative Purposes Only.',
      tag: 'Reusable',
      item_title: 'Laryngoscopes',
      item_subtitle: 'Prioritising Ergonomic Design Enhancing Lives',
      button_text: 'Meet The Laryngoscope',
      button_link: '/products?category=laryngoscopes',
      image_url: '/Rectangle 819 (1).svg',
    }
    setProductLine(defaults)
    saveProductLine(defaults)
    toast.success('Product Line showcase reset to defaults!')
  }

  const handleResetProjectDev = () => {
    const defaults: ProjectDevelopmentSection = {
      features: [
        { icon: '/LED Illumination-icon 1.svg', title: 'White LED\nIllumination' },
        { icon: '/Batteries-icon 1.svg', title: 'Pre-inserted\nBatteries' },
        { icon: '/Precision Engineering-icon 1.svg', title: 'Durable\nConstruction' },
        { icon: '/Global Presence-icon 1.svg', title: 'Global\nPresence' },
        { icon: '/Skilled Craftsmanship-icon 1.svg', title: 'Skilled\nCraftsmanship' },
      ],
      eyebrow: 'EXPLORE PRODUCTS',
      title_main: 'New Products',
      title_highlight: 'Project Development',
      paragraphs: [
        'From Concept To Finished Product, Transact Provides Reliable Solutions Tailored To The Needs Of Healthcare Professionals, Distributors And Global Medical Brands.',
        'Our Expertise Covers Design, Prototyping, Forging & Machining, Material Selection, Heat Treatment, Finishing & Polishing, And Final Product Development.',
        'With A Broad Portfolio Of Laryngoscopes And Diagnostic Instruments, We Continuously Develop Solutions Focused On Performance, Durability And Clinical Usability.',
      ],
      button_text: 'Learn More',
      button_link: '/production',
      image_url: '/image 351 (1).svg',
      steps: [
        'Design & Concept',
        'Prototyping',
        'Forging & Machining',
        'Material Selection',
        'Finishing & Polishing',
        'Final Product Development',
      ],
    }
    setProjectDev(defaults)
    saveProjectDev(defaults)
    toast.success('Project Development section reset to defaults!')
  }

  const handleSavePrecisionMfg = (e: React.FormEvent) => {
    e.preventDefault()
    savePrecisionMfg(precisionMfg)
    toast.success('Precision Manufacturing & Quality Control section updated successfully!')
  }

  const handleResetPrecisionMfg = () => {
    const defaults: PrecisionManufacturingSection = {
      eyebrow: 'QUALITY & MANUFACTURING',
      title_line1: 'PrecisionManufacturing &',
      title_line2: 'Quality Control',
      subtitle_p1:
        'Every Transact Instrument Passes Through Carefully Controlled Manufacturing And Inspection Processes.',
      subtitle_p2: 'Our Production Workflow Includes:',
      image_url: '/image 352.svg',
      steps: [
        { icon: '/Material-icon 1 (1).svg', title: 'Material\nSelection' },
        { icon: '/Forging & Machining-icon 1 (1).svg', title: 'Forging &\nMachining' },
        { icon: '/Heat Treatment-icon 1.svg', title: 'Heat\nTreatment' },
        { icon: '/Finishing-Polishing-icon 1 (1).svg', title: 'Finishing &\nPolishing' },
        { icon: '/Assembly-icon 1.svg', title: 'Assembly' },
        { icon: '/Quality Control-icon 1.svg', title: 'Quality\nControl' },
        { icon: '/Packing & Sterilization-icon 1 (1).svg', title: 'Packing &\nSterilization' },
      ],
      footnote:
        'We Focus On Consistent Quality, Precise Finishing And Dependable Performance Across Every Product.',
    }
    setPrecisionMfg(defaults)
    savePrecisionMfg(defaults)
    toast.success('Precision Manufacturing section reset to defaults!')
  }

  return (
    <div className="space-y-8">
      {/* ── Top Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#F6851F]/10 text-[#F6851F]">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-[#081022]">
              Homepage Showcase Sections
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Manage Complete Product Line, Project Development &amp; Precision Manufacturing live.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-zinc-200/80 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('productLine')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'productLine'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            1. Product Line
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projectDev')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'projectDev'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            2. Project Dev
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precisionMfg')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'precisionMfg'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            3. Precision Mfg &amp; QC
          </button>
        </div>
      </div>

      {/* ── TAB 1: Complete Product Line ── */}
      {activeTab === 'productLine' && (
        <form onSubmit={handleSaveProductLine} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Controls */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#081022] border-b border-zinc-100 pb-2">
                Header &amp; Card Texts
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Section Title</label>
                <input
                  type="text"
                  value={productLine.title}
                  onChange={(e) => setProductLine({ ...productLine, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Our Complete Product Line"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={productLine.subtitle}
                  onChange={(e) => setProductLine({ ...productLine, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Advanced Laryngoscopes Designed..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Card Badge Tag</label>
                  <input
                    type="text"
                    value={productLine.tag}
                    onChange={(e) => setProductLine({ ...productLine, tag: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="Reusable"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Card Main Title</label>
                  <input
                    type="text"
                    value={productLine.item_title}
                    onChange={(e) =>
                      setProductLine({ ...productLine, item_title: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="Laryngoscopes"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Card Subtitle</label>
                <input
                  type="text"
                  value={productLine.item_subtitle}
                  onChange={(e) =>
                    setProductLine({ ...productLine, item_subtitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Prioritising Ergonomic Design Enhancing Lives"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Button Text</label>
                  <input
                    type="text"
                    value={productLine.button_text}
                    onChange={(e) =>
                      setProductLine({ ...productLine, button_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="Meet The Laryngoscope"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Button Link URL</label>
                  <input
                    type="text"
                    value={productLine.button_link}
                    onChange={(e) =>
                      setProductLine({ ...productLine, button_link: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="/products?category=laryngoscopes"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Card Image Path</label>
                <input
                  type="text"
                  value={productLine.image_url}
                  onChange={(e) =>
                    setProductLine({ ...productLine, image_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none font-mono"
                  placeholder="/Rectangle 819 (1).svg"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#081022] hover:bg-[#F6851F] text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Product Line Changes
                </button>
                <button
                  type="button"
                  onClick={handleResetProductLine}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Live Preview (ss 1)
              </span>

              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 space-y-5">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-[#081022]">{productLine.title}</h3>
                  <p className="text-[11px] text-zinc-500 whitespace-pre-line">
                    {productLine.subtitle}
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden aspect-[16/9] bg-zinc-200 p-5 flex flex-col justify-between border border-zinc-300">
                  <Image
                    src={productLine.image_url || '/Rectangle 819 (1).svg'}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="relative z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shadow">
                    <Image
                      src="/laryngoscope 2.svg"
                      alt="Icon"
                      width={16}
                      height={16}
                      unoptimized
                    />
                  </div>
                  <div className="relative z-10 flex items-end justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-white/30 text-white text-[9px] font-bold">
                        {productLine.tag}
                      </span>
                      <h4 className="text-xl font-black text-white mt-1">
                        {productLine.item_title}
                      </h4>
                      <p className="text-[10px] text-zinc-100">{productLine.item_subtitle}</p>
                    </div>
                    <span className="px-3 py-1 bg-[#F6851F] text-white text-[10px] font-bold rounded-full">
                      {productLine.button_text} →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 2: Project Development ── */}
      {activeTab === 'projectDev' && (
        <form onSubmit={handleSaveProjectDev} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Controls */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-[#081022] border-b border-zinc-100 pb-2">
                Header &amp; Text Content
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Eyebrow</label>
                  <input
                    type="text"
                    value={projectDev.eyebrow}
                    onChange={(e) => setProjectDev({ ...projectDev, eyebrow: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="EXPLORE PRODUCTS"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Title Main</label>
                  <input
                    type="text"
                    value={projectDev.title_main}
                    onChange={(e) =>
                      setProjectDev({ ...projectDev, title_main: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="New Products"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Title Highlight (Orange)</label>
                <input
                  type="text"
                  value={projectDev.title_highlight}
                  onChange={(e) =>
                    setProjectDev({ ...projectDev, title_highlight: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Project Development"
                />
              </div>

              {/* 3 Paragraphs */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#081022]">3 Content Paragraphs</label>
                {projectDev.paragraphs.map((para, i) => (
                  <textarea
                    key={i}
                    rows={2}
                    value={para}
                    onChange={(e) => {
                      const updated = [...projectDev.paragraphs]
                      updated[i] = e.target.value
                      setProjectDev({ ...projectDev, paragraphs: updated })
                    }}
                    className="w-full px-3.5 py-1.5 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder={`Paragraph ${i + 1}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Button Text</label>
                  <input
                    type="text"
                    value={projectDev.button_text}
                    onChange={(e) =>
                      setProjectDev({ ...projectDev, button_text: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="Learn More"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Button Link URL</label>
                  <input
                    type="text"
                    value={projectDev.button_link}
                    onChange={(e) =>
                      setProjectDev({ ...projectDev, button_link: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="/production"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Center Blueprint Image URL</label>
                <input
                  type="text"
                  value={projectDev.image_url}
                  onChange={(e) =>
                    setProjectDev({ ...projectDev, image_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none font-mono"
                  placeholder="/image 351 (1).svg"
                />
              </div>

              {/* 6 Steps */}
              <div className="space-y-2 border-t border-zinc-100 pt-3">
                <label className="text-xs font-bold text-[#081022]">6 Process Steps</label>
                <div className="grid grid-cols-2 gap-2">
                  {projectDev.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-zinc-400">0{i + 1}</span>
                      <input
                        type="text"
                        value={step}
                        onChange={(e) => {
                          const updated = [...projectDev.steps]
                          updated[i] = e.target.value
                          setProjectDev({ ...projectDev, steps: updated })
                        }}
                        className="w-full px-2.5 py-1 text-xs border border-zinc-300 rounded-lg focus:border-[#F6851F] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#081022] hover:bg-[#F6851F] text-white text-xs font-bold rounded-xl transition shadow cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Project Development Changes
                </button>
                <button
                  type="button"
                  onClick={handleResetProjectDev}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Live Preview (ss 2)
              </span>

              <div className="bg-zinc-50 p-6 rounded-3xl border border-zinc-200 space-y-6">
                {/* 5 Features */}
                <div className="grid grid-cols-5 gap-2 border-b border-zinc-200 pb-4 text-center">
                  {projectDev.features.map((feat, i) => (
                    <div key={i} className="space-y-1">
                      <div className="w-8 h-8 mx-auto flex items-center justify-center">
                        <Image
                          src={feat.icon}
                          alt="Icon"
                          width={24}
                          height={24}
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <p className="text-[9px] font-bold text-[#081022] whitespace-pre-line leading-none">
                        {feat.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* 3 Columns */}
                <div className="grid grid-cols-3 gap-3 items-center">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-bold text-[#F6851F]">
                      {projectDev.eyebrow}
                    </span>
                    <h4 className="text-xs font-black text-[#081022]">
                      {projectDev.title_main}{' '}
                      <span className="text-[#F6851F]">{projectDev.title_highlight}</span>
                    </h4>
                    <p className="text-[8px] text-zinc-500 line-clamp-3">
                      {projectDev.paragraphs[0]}
                    </p>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#081022] text-white text-[8px] font-bold">
                      {projectDev.button_text}
                    </span>
                  </div>

                  <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-white">
                    <Image
                      src={projectDev.image_url || '/image 351 (1).svg'}
                      alt="Blueprint"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    {projectDev.steps.map((s, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="w-3.5 h-3.5 rounded-full bg-zinc-200 text-[7px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[8px] font-bold text-zinc-700 truncate">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ── TAB 3: Precision Manufacturing & Quality Control (ss 1) ── */}
      {activeTab === 'precisionMfg' && (
        <form onSubmit={handleSavePrecisionMfg} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Controls */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-[#081022] border-b border-zinc-100 pb-2">
                Header &amp; Subtitle Texts
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Eyebrow</label>
                <input
                  type="text"
                  value={precisionMfg.eyebrow}
                  onChange={(e) => setPrecisionMfg({ ...precisionMfg, eyebrow: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="QUALITY & MANUFACTURING"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">Title Line 1</label>
                  <input
                    type="text"
                    value={precisionMfg.title_line1}
                    onChange={(e) =>
                      setPrecisionMfg({ ...precisionMfg, title_line1: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="PrecisionManufacturing &"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#081022]">
                    Title Line 2 (Orange)
                  </label>
                  <input
                    type="text"
                    value={precisionMfg.title_line2}
                    onChange={(e) =>
                      setPrecisionMfg({ ...precisionMfg, title_line2: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                    placeholder="Quality Control"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Primary Paragraph</label>
                <textarea
                  rows={2}
                  value={precisionMfg.subtitle_p1}
                  onChange={(e) =>
                    setPrecisionMfg({ ...precisionMfg, subtitle_p1: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Every Transact Instrument Passes..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Workflow Sub-heading</label>
                <input
                  type="text"
                  value={precisionMfg.subtitle_p2}
                  onChange={(e) =>
                    setPrecisionMfg({ ...precisionMfg, subtitle_p2: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Our Production Workflow Includes:"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Image URL / Path</label>
                <input
                  type="text"
                  value={precisionMfg.image_url}
                  onChange={(e) =>
                    setPrecisionMfg({ ...precisionMfg, image_url: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="/image 352.svg"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#081022]">Bottom Footnote</label>
                <textarea
                  rows={2}
                  value={precisionMfg.footnote}
                  onChange={(e) =>
                    setPrecisionMfg({ ...precisionMfg, footnote: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="We Focus On Consistent Quality..."
                />
              </div>

              {/* 7 Workflow Steps */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-[#081022] mb-3">
                  Production Workflow Steps (7 Items)
                </h3>
                <div className="space-y-2.5">
                  {precisionMfg.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50/50 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-500">
                        <span>Step {idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const newSteps = [...precisionMfg.steps]
                            newSteps[idx].title = e.target.value
                            setPrecisionMfg({ ...precisionMfg, steps: newSteps })
                          }}
                          className="px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:border-[#F6851F] focus:outline-none"
                          placeholder="Title"
                        />
                        <input
                          type="text"
                          value={step.icon}
                          onChange={(e) => {
                            const newSteps = [...precisionMfg.steps]
                            newSteps[idx].icon = e.target.value
                            setPrecisionMfg({ ...precisionMfg, steps: newSteps })
                          }}
                          className="px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:border-[#F6851F] focus:outline-none"
                          placeholder="Icon SVG path"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#F6851F] hover:bg-[#e07316] text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  Save Precision Mfg Changes
                </button>
                <button
                  type="button"
                  onClick={handleResetPrecisionMfg}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F6851F]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                  Live Preview (ss 1 Bottom)
                </h3>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-md space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-zinc-200 bg-[#081022]">
                    <Image
                      src={precisionMfg.image_url || '/image 352.svg'}
                      alt="CNC Machine"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase tracking-wider text-[#F6851F] block">
                      {precisionMfg.eyebrow}
                    </span>
                    <h4 className="text-sm font-black text-[#081022] leading-tight">
                      {precisionMfg.title_line1}{' '}
                      <span className="text-[#F6851F] block">{precisionMfg.title_line2}</span>
                    </h4>
                    <p className="text-[9px] text-[#4B5D71] leading-tight">
                      {precisionMfg.subtitle_p1}
                    </p>
                    <p className="text-[9px] font-bold text-[#081022]">
                      {precisionMfg.subtitle_p2}
                    </p>
                  </div>
                </div>

                {/* Workflow row */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto pt-2 pb-2 border-t border-zinc-100">
                  {precisionMfg.steps.map((st, i) => (
                    <React.Fragment key={i}>
                      <div className="flex flex-col items-center text-center shrink-0 min-w-[48px]">
                        <div className="w-6 h-6 flex items-center justify-center mb-1">
                          <Image
                            src={st.icon}
                            alt={st.title}
                            width={22}
                            height={22}
                            unoptimized
                            className="object-contain"
                          />
                        </div>
                        <span className="text-[7px] font-bold text-zinc-800 leading-tight whitespace-pre-line">
                          {st.title}
                        </span>
                      </div>
                      {i < precisionMfg.steps.length - 1 && (
                        <span className="text-[#F6851F] text-[10px] font-bold select-none shrink-0 mb-3">
                          ›
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <p className="text-[8px] text-zinc-500 leading-relaxed border-t border-zinc-100 pt-2">
                  {precisionMfg.footnote}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
