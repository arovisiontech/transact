'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Save,
  Layers,
  Sparkles,
  Sliders,
  Building2,
  ShieldCheck,
  Globe2,
  Workflow,
  Factory,
  Cpu,
  MapPin,
  ExternalLink,
  Plus,
  Trash2,
  ArrowRight,
  CheckCircle2,
  UploadCloud,
  Link2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStoredImpactNumbers,
  saveImpactNumbers,
  ImpactNumbersData,
  getStoredAboutFacility,
  saveAboutFacility,
  AboutFacilityData,
  getStoredTrustFeatures,
  saveTrustFeatures,
  TrustFeaturesData,
  getStoredGlobalPartner,
  saveGlobalPartner,
  GlobalPartnerData,
  getStoredLaryngoscopeExpertise,
  saveLaryngoscopeExpertise,
  LaryngoscopeExpertiseData,
  getStoredFooterInfo,
  saveFooterInfo,
  FooterInfoData,
  getStoredProjectDev,
  saveProjectDev,
  getStoredPrecisionMfg,
  savePrecisionMfg,
  getStoredProductLine,
  saveProductLine,
  getStoredCategories,
} from '@/src/lib/dataStore'
import {
  ProjectDevelopmentSection,
  PrecisionManufacturingSection,
  ProductLineShowcase,
  CategoryItem,
} from '@/src/types'

type HomeTab =
  | 'overview'
  | 'impact'
  | 'about'
  | 'trust'
  | 'showcase_airway'
  | 'project_dev'
  | 'precision_mfg'
  | 'global_partner'
  | 'expertise'
  | 'showcase_diag'
  | 'footer'

export default function AdminHomePageEditor() {
  const [activeTab, setActiveTab] = useState<HomeTab>('about')

  // State for all homepage sections
  const [impactData, setImpactData] = useState<ImpactNumbersData>(getStoredImpactNumbers())
  const [aboutData, setAboutData] = useState<AboutFacilityData>(getStoredAboutFacility())
  const [trustData, setTrustData] = useState<TrustFeaturesData>(getStoredTrustFeatures())
  const [productLineHeader, setProductLineHeader] = useState<ProductLineShowcase>(getStoredProductLine())
  const [projectDevData, setProjectDevData] = useState<ProjectDevelopmentSection>(getStoredProjectDev())
  const [precisionMfgData, setPrecisionMfgData] = useState<PrecisionManufacturingSection>(getStoredPrecisionMfg())
  const [globalPartnerData, setGlobalPartnerData] = useState<GlobalPartnerData>(getStoredGlobalPartner())
  const [expertiseData, setExpertiseData] = useState<LaryngoscopeExpertiseData>(getStoredLaryngoscopeExpertise())
  const [footerData, setFooterData] = useState<FooterInfoData>(getStoredFooterInfo())
  const [categories, setCategories] = useState<CategoryItem[]>([])

  const reloadAll = () => {
    setImpactData(getStoredImpactNumbers())
    setAboutData(getStoredAboutFacility())
    setTrustData(getStoredTrustFeatures())
    setProductLineHeader(getStoredProductLine())
    setProjectDevData(getStoredProjectDev())
    setPrecisionMfgData(getStoredPrecisionMfg())
    setGlobalPartnerData(getStoredGlobalPartner())
    setExpertiseData(getStoredLaryngoscopeExpertise())
    setFooterData(getStoredFooterInfo())
    setCategories(getStoredCategories())
  }

  useEffect(() => {
    reloadAll()
    const onUpdate = () => reloadAll()
    window.addEventListener('transact_data_updated', onUpdate)
    return () => window.removeEventListener('transact_data_updated', onUpdate)
  }, [])

  // Section 1 vs Section 2 categories
  const airwayCats = categories.filter((c) => c.section === 'airway' || !c.section || c.section === 'section_1')
  const diagCats = categories.filter((c) => c.section === 'diagnostics' || c.section === 'section_2')

  // Save Handlers
  const handleSaveAbout = (e: React.FormEvent) => {
    e.preventDefault()
    saveAboutFacility(aboutData)
    toast.success('About & Facility Section updated successfully!')
  }

  const handleSaveImpact = (e: React.FormEvent) => {
    e.preventDefault()
    saveImpactNumbers(impactData)
    toast.success('Impact in Numbers updated successfully!')
  }

  const handleSaveTrust = (e: React.FormEvent) => {
    e.preventDefault()
    saveTrustFeatures(trustData)
    toast.success('Trust & Quality Features updated successfully!')
  }

  const handleSaveProductLine = (e: React.FormEvent) => {
    e.preventDefault()
    saveProductLine(productLineHeader)
    toast.success('Product Line Showcase header updated!')
  }

  const handleSaveProjectDev = (e: React.FormEvent) => {
    e.preventDefault()
    saveProjectDev(projectDevData)
    toast.success('Project Development Section updated!')
  }

  const handleSavePrecisionMfg = (e: React.FormEvent) => {
    e.preventDefault()
    savePrecisionMfg(precisionMfgData)
    toast.success('Precision Manufacturing Section updated!')
  }

  const handleSaveGlobalPartner = (e: React.FormEvent) => {
    e.preventDefault()
    saveGlobalPartner(globalPartnerData)
    toast.success('Global B2B Partner Section updated!')
  }

  const handleSaveExpertise = (e: React.FormEvent) => {
    e.preventDefault()
    saveLaryngoscopeExpertise(expertiseData)
    toast.success('Laryngoscope Expertise Section updated!')
  }

  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault()
    saveFooterInfo(footerData)
    toast.success('Footer & Locations updated successfully!')
  }

  const tabs: { key: HomeTab; label: string; icon: React.ElementType; sectionBadge: string }[] = [
    { key: 'about', label: 'About Facility (SS 1)', icon: Building2, sectionBadge: 'Section 3' },
    { key: 'showcase_airway', label: 'Airway Showcase (SS 2)', icon: Layers, sectionBadge: 'Section 5' },
    { key: 'showcase_diag', label: 'Diagnostics Showcase (SS 5)', icon: Cpu, sectionBadge: 'Section 10' },
    { key: 'impact', label: 'Impact in Numbers', icon: Sparkles, sectionBadge: 'Section 2' },
    { key: 'trust', label: 'Trust & Metallurgy', icon: ShieldCheck, sectionBadge: 'Section 4' },
    { key: 'project_dev', label: 'Project Development', icon: Workflow, sectionBadge: 'Section 6' },
    { key: 'precision_mfg', label: 'Precision Manufacturing', icon: Factory, sectionBadge: 'Section 7' },
    { key: 'global_partner', label: 'Global B2B Partner', icon: Globe2, sectionBadge: 'Section 8' },
    { key: 'expertise', label: 'Laryngoscope Expertise', icon: Sliders, sectionBadge: 'Section 9' },
    { key: 'footer', label: 'Locations & Footer', icon: MapPin, sectionBadge: 'Section 12' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Home Page Section-by-Section Editor
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Complete control over all 12 homepage sections, content, corner-to-corner visuals, categories, and statistics.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081022] hover:bg-[#1a233a] text-white text-xs font-bold transition shadow self-start sm:self-auto cursor-pointer"
        >
          <span>View Live Home Page</span>
          <ExternalLink className="w-4 h-4 text-[#F6851F]" />
        </Link>
      </div>

      {/* Main Horizontal Tab Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-200">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#F6851F] text-white shadow-md'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] ${
                  isActive ? 'bg-white/25 text-white' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {tab.sectionBadge}
              </span>
            </button>
          )
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: About & Facility Section (SS 1 Corner-to-Corner)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'about' && (
        <form onSubmit={handleSaveAbout} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                  Section 3 • SS 1
                </span>
                <h2 className="text-lg font-bold text-[#081022]">About Facility &amp; Precision Manufacturing</h2>
              </div>
              <p className="text-xs text-[#5B6776] mt-0.5">
                Features the corner-to-corner building image on the right and company intro text on the left.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save About Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Text fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow Badge Tag</label>
                <input
                  type="text"
                  value={aboutData.eyebrow}
                  onChange={(e) => setAboutData({ ...aboutData, eyebrow: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Section Title</label>
                <input
                  type="text"
                  value={aboutData.title}
                  onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Title Highlight (Orange Color)</label>
                <input
                  type="text"
                  value={aboutData.title_highlight}
                  onChange={(e) => setAboutData({ ...aboutData, title_highlight: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Paragraph 1</label>
                <textarea
                  rows={3}
                  value={aboutData.paragraph_1}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph_1: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Paragraph 2</label>
                <textarea
                  rows={3}
                  value={aboutData.paragraph_2}
                  onChange={(e) => setAboutData({ ...aboutData, paragraph_2: e.target.value })}
                  className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#081022] mb-1">Button Text</label>
                  <input
                    type="text"
                    value={aboutData.button_text}
                    onChange={(e) => setAboutData({ ...aboutData, button_text: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#081022] mb-1">Button Link</label>
                  <input
                    type="text"
                    value={aboutData.button_link}
                    onChange={(e) => setAboutData({ ...aboutData, button_link: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                  />
                </div>
              </div>
            </div>

            {/* Right: Checklist & Image */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">
                  Facility Checklist Points (One per line)
                </label>
                <textarea
                  rows={6}
                  value={aboutData.checklist.join('\n')}
                  onChange={(e) =>
                    setAboutData({
                      ...aboutData,
                      checklist: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                    })
                  }
                  className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">
                  Corner-to-Corner Building Image URL
                </label>
                <input
                  type="text"
                  value={aboutData.image_url}
                  onChange={(e) => setAboutData({ ...aboutData, image_url: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>

              {/* Live Preview Box of Corner-to-Corner Image */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-zinc-200">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">
                  Corner-to-Corner Visual Preview (Right Edge Flush)
                </span>
                <div className="relative w-full aspect-[16/9] rounded-l-2xl rounded-r-none overflow-hidden border-2 border-white shadow">
                  <Image
                    src={aboutData.image_url || '/building-jpg 1.svg'}
                    alt="Building Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 px-2.5 py-1 rounded-md text-[10px] font-bold text-[#081022] shadow">
                    Right Corner Flush
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: Section 1 Airway Showcase (SS 2)                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'showcase_airway' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                  Section 5 • SS 2
                </span>
                <h2 className="text-lg font-bold text-[#081022]">Section 1: Airway Management Showcase (Laryngoscopes)</h2>
              </div>
              <p className="text-xs text-[#5B6776] mt-0.5">
                Displays the smooth stacking cards on the homepage. Entire card is clickable to open category.
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="px-4 py-2 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Section 1 Categories</span>
            </Link>
          </div>

          {/* Section Header Editor */}
          <form onSubmit={handleSaveProductLine} className="p-5 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">Section Title &amp; Subtitle</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Section Title</label>
                <input
                  type="text"
                  value={productLineHeader.title}
                  onChange={(e) => setProductLineHeader({ ...productLineHeader, title: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#081022] mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={productLineHeader.subtitle}
                  onChange={(e) => setProductLineHeader({ ...productLineHeader, subtitle: e.target.value })}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#081022] hover:bg-[#1a233a] text-white text-xs font-bold transition cursor-pointer"
            >
              Update Section 1 Header
            </button>
          </form>

          {/* Active Cards in this section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Live Categories In Section 1 ({airwayCats.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {airwayCats.map((cat, idx) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-zinc-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-zinc-200">
                      <Image
                        src={cat.card_image || cat.image_url || '/Rectangle 819 (1).svg'}
                        alt={cat.name}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#F6851F]">Card 0{idx + 1} / 0{airwayCats.length}</span>
                      <h4 className="text-xs font-bold text-[#081022]">{cat.name}</h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-white border border-zinc-200 hover:border-[#F6851F] text-zinc-600 hover:text-[#F6851F] transition"
                    title="Test Click Navigation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: Section 2 Diagnostics Showcase (SS 5)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'showcase_diag' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Section 10 • SS 5
                </span>
                <h2 className="text-lg font-bold text-[#081022]">Section 2: Diagnostics &amp; Otoscopy Showcase</h2>
              </div>
              <p className="text-xs text-[#5B6776] mt-0.5">
                Displays the diagnostics stacking cards on the homepage. Entire card is clickable to open category.
              </p>
            </div>
            <Link
              href="/admin/categories"
              className="px-4 py-2 bg-[#1E3A8A] hover:bg-[#152860] text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Section 2 Categories</span>
            </Link>
          </div>

          {/* Active Cards in this section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Live Categories In Section 2 ({diagCats.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {diagCats.map((cat, idx) => (
                <div key={cat.id} className="p-4 rounded-2xl bg-[#F8FAFC] border border-zinc-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0 border border-zinc-200">
                      <Image
                        src={cat.card_image || cat.image_url || '/image 351 (1).svg'}
                        alt={cat.name}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600">Card 0{idx + 1} / 0{diagCats.length}</span>
                      <h4 className="text-xs font-bold text-[#081022]">{cat.name}</h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-1">{cat.description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-white border border-zinc-200 hover:border-blue-600 text-zinc-600 hover:text-blue-600 transition"
                    title="Test Click Navigation"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: Impact in Numbers (Section 2)                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'impact' && (
        <form onSubmit={handleSaveImpact} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
                Section 2
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Our Impact in Numbers</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Impact Numbers</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow Title</label>
              <input
                type="text"
                value={impactData.eyebrow}
                onChange={(e) => setImpactData({ ...impactData, eyebrow: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow Accent (Blue)</label>
              <input
                type="text"
                value={impactData.eyebrow_accent}
                onChange={(e) => setImpactData({ ...impactData, eyebrow_accent: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Tagline</label>
              <input
                type="text"
                value={impactData.tagline}
                onChange={(e) => setImpactData({ ...impactData, tagline: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">4 Highlight Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {impactData.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-zinc-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#F6851F] uppercase">Stat {idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500">Value (e.g. 1800SQ +)</label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => {
                        const updated = [...impactData.stats]
                        updated[idx].value = e.target.value
                        setImpactData({ ...impactData, stats: updated })
                      }}
                      className="w-full text-xs font-bold px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500">Label</label>
                    <input
                      type="text"
                      value={stat.label}
                      onChange={(e) => {
                        const updated = [...impactData.stats]
                        updated[idx].label = e.target.value
                        setImpactData({ ...impactData, stats: updated })
                      }}
                      className="w-full text-xs px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: Trust & Quality Features (Section 4)                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'trust' && (
        <form onSubmit={handleSaveTrust} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                Section 4
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Built For Safety • Quality You Can Trust</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Trust Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow</label>
              <input
                type="text"
                value={trustData.eyebrow}
                onChange={(e) => setTrustData({ ...trustData, eyebrow: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Heading</label>
              <input
                type="text"
                value={trustData.title}
                onChange={(e) => setTrustData({ ...trustData, title: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Subtitle</label>
            <textarea
              rows={2}
              value={trustData.subtitle}
              onChange={(e) => setTrustData({ ...trustData, subtitle: e.target.value })}
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">5 Trust Pillars</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trustData.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-zinc-200 space-y-2">
                  <span className="text-[10px] font-bold text-[#F6851F]">Pillar {idx + 1}</span>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500">Title</label>
                    <input
                      type="text"
                      value={feat.title}
                      onChange={(e) => {
                        const updated = [...trustData.features]
                        updated[idx].title = e.target.value
                        setTrustData({ ...trustData, features: updated })
                      }}
                      className="w-full text-xs font-bold px-3 py-2 rounded-lg bg-white border border-zinc-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-500">Description</label>
                    <textarea
                      rows={2}
                      value={feat.description}
                      onChange={(e) => {
                        const updated = [...trustData.features]
                        updated[idx].description = e.target.value
                        setTrustData({ ...trustData, features: updated })
                      }}
                      className="w-full text-xs p-2 rounded-lg bg-white border border-zinc-200 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 6: Project Development (Section 6)                        */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'project_dev' && (
        <form onSubmit={handleSaveProjectDev} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                Section 6
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">New Products Project Development</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Project Dev</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow</label>
              <input
                type="text"
                value={projectDevData.eyebrow}
                onChange={(e) => setProjectDevData({ ...projectDevData, eyebrow: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Main Heading</label>
              <input
                type="text"
                value={projectDevData.title_main}
                onChange={(e) => setProjectDevData({ ...projectDevData, title_main: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Heading Highlight</label>
              <input
                type="text"
                value={projectDevData.title_highlight}
                onChange={(e) => setProjectDevData({ ...projectDevData, title_highlight: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-[#081022]">Paragraphs</label>
            {projectDevData.paragraphs.map((p, idx) => (
              <textarea
                key={idx}
                rows={2}
                value={p}
                onChange={(e) => {
                  const updated = [...projectDevData.paragraphs]
                  updated[idx] = e.target.value
                  setProjectDevData({ ...projectDevData, paragraphs: updated })
                }}
                className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">6 Development Steps</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {projectDevData.steps.map((st, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-zinc-200 space-y-1 text-center">
                  <span className="text-[10px] font-bold text-[#F6851F]">Step {idx + 1}</span>
                  <input
                    type="text"
                    value={st}
                    onChange={(e) => {
                      const updated = [...projectDevData.steps]
                      updated[idx] = e.target.value
                      setProjectDevData({ ...projectDevData, steps: updated })
                    }}
                    className="w-full text-[11px] font-bold text-center px-2 py-1 rounded bg-white border border-zinc-200 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 7: Precision Manufacturing (Section 7)                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'precision_mfg' && (
        <form onSubmit={handleSavePrecisionMfg} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                Section 7
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Precision Manufacturing &amp; Quality Control</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Precision Mfg</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Title Line 1</label>
              <input
                type="text"
                value={precisionMfgData.title_line1}
                onChange={(e) => setPrecisionMfgData({ ...precisionMfgData, title_line1: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Title Line 2</label>
              <input
                type="text"
                value={precisionMfgData.title_line2}
                onChange={(e) => setPrecisionMfgData({ ...precisionMfgData, title_line2: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Paragraph 1</label>
              <textarea
                rows={2}
                value={precisionMfgData.subtitle_p1}
                onChange={(e) => setPrecisionMfgData({ ...precisionMfgData, subtitle_p1: e.target.value })}
                className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Workflow Steps (One per line)</label>
              <textarea
                rows={4}
                value={precisionMfgData.steps.map((s) => s.title.replace('\n', ' ')).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter((l) => l.trim().length > 0)
                  setPrecisionMfgData({
                    ...precisionMfgData,
                    steps: lines.map((l, i) => ({
                      icon: precisionMfgData.steps[i]?.icon || '/Material-icon 1 (1).svg',
                      title: l,
                    })),
                  })
                }}
                className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 8: Global B2B Partner (Section 8)                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'global_partner' && (
        <form onSubmit={handleSaveGlobalPartner} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                Section 8
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Global B2B Partnership</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Global Partner</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow</label>
              <input
                type="text"
                value={globalPartnerData.eyebrow}
                onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, eyebrow: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Title</label>
              <input
                type="text"
                value={globalPartnerData.title}
                onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, title: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Paragraph 1</label>
            <textarea
              rows={2}
              value={globalPartnerData.paragraph_1}
              onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, paragraph_1: e.target.value })}
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Paragraph 2</label>
            <textarea
              rows={2}
              value={globalPartnerData.paragraph_2}
              onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, paragraph_2: e.target.value })}
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Pill Button Main Text</label>
              <input
                type="text"
                value={globalPartnerData.primary_btn_text}
                onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, primary_btn_text: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Pill Button Tag 1</label>
              <input
                type="text"
                value={globalPartnerData.tag_1}
                onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, tag_1: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Pill Button Tag 2</label>
              <input
                type="text"
                value={globalPartnerData.tag_2}
                onChange={(e) => setGlobalPartnerData({ ...globalPartnerData, tag_2: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 9: Laryngoscope Expertise (Section 9)                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'expertise' && (
        <form onSubmit={handleSaveExpertise} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-orange-50 text-[#F6851F] border border-orange-200">
                Section 9
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Laryngoscope Expertise • Built for Precision</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Expertise Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Eyebrow</label>
              <input
                type="text"
                value={expertiseData.eyebrow}
                onChange={(e) => setExpertiseData({ ...expertiseData, eyebrow: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Title</label>
              <input
                type="text"
                value={expertiseData.title}
                onChange={(e) => setExpertiseData({ ...expertiseData, title: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Description</label>
            <textarea
              rows={3}
              value={expertiseData.description}
              onChange={(e) => setExpertiseData({ ...expertiseData, description: e.target.value })}
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">
              Manufacturing Process Step Pills (One per line)
            </label>
            <textarea
              rows={7}
              value={expertiseData.steps.join('\n')}
              onChange={(e) =>
                setExpertiseData({
                  ...expertiseData,
                  steps: e.target.value.split('\n').filter((l) => l.trim().length > 0),
                })
              }
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>
        </form>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 10: Footer & Locations (Section 12)                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'footer' && (
        <form onSubmit={handleSaveFooter} className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100">
            <div>
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-300">
                Section 12
              </span>
              <h2 className="text-lg font-bold text-[#081022] mt-1">Our Locations &amp; Footer Contact Info</h2>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Footer Info</span>
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Company Name</label>
            <input
              type="text"
              value={footerData.company_name}
              onChange={(e) => setFooterData({ ...footerData, company_name: e.target.value })}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">Facility Address</label>
            <textarea
              rows={2}
              value={footerData.address}
              onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Phone Numbers</label>
              <input
                type="text"
                value={footerData.phones}
                onChange={(e) => setFooterData({ ...footerData, phones: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Official Email</label>
              <input
                type="email"
                value={footerData.email}
                onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
