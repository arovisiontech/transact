'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import {
  Layers,
  Save,
  CheckCircle,
  XCircle,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  UploadCloud,
  Image as ImageIcon,
  Loader2,
  Link2,
  X,
  Sliders,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getStoredProductLine,
  saveProductLine,
  getStoredProductLineCards,
  saveProductLineCards,
  saveProductLineCard,
  deleteProductLineCard,
  moveProductLineCardOrder,
  getStoredOtoscopeCards,
  saveOtoscopeCards,
  saveOtoscopeCard,
  deleteOtoscopeCard,
  moveOtoscopeCardOrder,
  getStoredProjectDev,
  saveProjectDev,
  getStoredPrecisionMfg,
  savePrecisionMfg,
} from '@/src/lib/dataStore'
import {
  ProductLineShowcase,
  PortfolioShowcaseCard,
  ProjectDevelopmentSection,
  PrecisionManufacturingSection,
} from '@/src/types'

export default function AdminProductLinePage() {
  const [activeTab, setActiveTab] = useState<
    'productLine' | 'otoscopeShowcase' | 'projectDev' | 'precisionMfg'
  >('productLine')

  // Product Line Showcase Header State
  const [productLine, setProductLine] = useState<ProductLineShowcase>(getStoredProductLine())

  // SS 2 & SS 3 Showcase Cards States
  const [portfolioCards, setPortfolioCards] = useState<PortfolioShowcaseCard[]>([])
  const [otoscopeCards, setOtoscopeCards] = useState<PortfolioShowcaseCard[]>([])

  // Project Development State
  const [projectDev, setProjectDev] = useState<ProjectDevelopmentSection>(getStoredProjectDev())

  // Precision Manufacturing State
  const [precisionMfg, setPrecisionMfg] = useState<PrecisionManufacturingSection>(getStoredPrecisionMfg())

  // Card Modal State
  const [isCardModalOpen, setIsCardModalOpen] = useState(false)
  const [cardModalTarget, setCardModalTarget] = useState<'productLine' | 'otoscope'>('productLine')
  const [editingCard, setEditingCard] = useState<PortfolioShowcaseCard | null>(null)

  const [cardFormData, setCardFormData] = useState<PortfolioShowcaseCard>({
    id: '',
    tag: 'Reusable & Disposable Airway Management',
    title: '',
    subtitle: '',
    image: '/Rectangle 819 (1).svg',
    badgeIcon: '/laryngoscope 2.svg',
    badgeBg: 'bg-white/95',
    buttonText: 'Meet The Line',
    buttonLink: '/products?category=reusable-laryngoscopes',
    indexLabel: '01 / 02',
    sort_order: 1,
    is_active: true,
  })

  // Card Image & Icon Upload State
  const cardImageInputRef = useRef<HTMLInputElement>(null)
  const cardIconInputRef = useRef<HTMLInputElement>(null)
  const [isCardImageUploading, setIsCardImageUploading] = useState(false)
  const [isCardIconUploading, setIsCardIconUploading] = useState(false)
  const [isCardImageDragOver, setIsCardImageDragOver] = useState(false)
  const [showCardImageManualUrl, setShowCardImageManualUrl] = useState(false)
  const [showCardIconManualUrl, setShowCardIconManualUrl] = useState(false)

  const reloadData = () => {
    setProductLine(getStoredProductLine())
    setPortfolioCards(getStoredProductLineCards())
    setOtoscopeCards(getStoredOtoscopeCards())
    setProjectDev(getStoredProjectDev())
    setPrecisionMfg(getStoredPrecisionMfg())
  }

  useEffect(() => {
    reloadData()
    const handleUpdate = () => reloadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  // ── Header Save ──
  const handleSaveProductLineHeader = (e: React.FormEvent) => {
    e.preventDefault()
    saveProductLine(productLine)
    toast.success('Complete Product Line header updated successfully!')
  }

  // ── Card Management Handlers ──
  const handleOpenAddCard = (target: 'productLine' | 'otoscope') => {
    setCardModalTarget(target)
    setEditingCard(null)
    const list = target === 'productLine' ? portfolioCards : otoscopeCards
    const newIdx = list.length + 1
    const total = Math.max(list.length + 1, 2)
    setShowCardImageManualUrl(false)
    setShowCardIconManualUrl(false)

    setCardFormData({
      id: `card-${target}-${Date.now()}`,
      tag: target === 'productLine' ? 'Reusable & Disposable Airway Management' : 'Pocket Diagnostic',
      title: '',
      subtitle: '',
      image: target === 'productLine' ? '/Rectangle 819 (1).svg' : '/Rectangle 839.svg',
      badgeIcon: target === 'productLine' ? '/laryngoscope 2.svg' : '/Diagnostics 2.svg',
      badgeBg: target === 'productLine' ? 'bg-white/95' : 'bg-[#F6851F]',
      buttonText: 'Meet The Line',
      buttonLink: '/products',
      indexLabel: `0${newIdx} / 0${total}`,
      sort_order: newIdx,
      is_active: true,
    })
    setIsCardModalOpen(true)
  }

  const handleOpenEditCard = (card: PortfolioShowcaseCard, target: 'productLine' | 'otoscope') => {
    setCardModalTarget(target)
    setEditingCard(card)
    setShowCardImageManualUrl(false)
    setShowCardIconManualUrl(false)
    setCardFormData({ ...card })
    setIsCardModalOpen(true)
  }

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!cardFormData.title.trim()) {
      toast.error('Card title is required')
      return
    }

    if (cardModalTarget === 'productLine') {
      saveProductLineCard(cardFormData)
      setPortfolioCards(getStoredProductLineCards())
    } else {
      saveOtoscopeCard(cardFormData)
      setOtoscopeCards(getStoredOtoscopeCards())
    }

    toast.success(editingCard ? 'Showcase card updated!' : 'New showcase card added!')
    setIsCardModalOpen(false)
  }

  const handleDeleteCard = (id: string, title: string, target: 'productLine' | 'otoscope') => {
    if (confirm(`Are you sure you want to delete showcase card "${title}"?`)) {
      if (target === 'productLine') {
        const updated = deleteProductLineCard(id)
        setPortfolioCards(updated)
      } else {
        const updated = deleteOtoscopeCard(id)
        setOtoscopeCards(updated)
      }
      toast.success('Showcase card deleted')
    }
  }

  const handleMoveCard = (id: string, direction: 'up' | 'down', target: 'productLine' | 'otoscope') => {
    if (target === 'productLine') {
      const updated = moveProductLineCardOrder(id, direction)
      setPortfolioCards(updated)
    } else {
      const updated = moveOtoscopeCardOrder(id, direction)
      setOtoscopeCards(updated)
    }
    toast.success(`Card moved ${direction}`)
  }

  const handleToggleCardActive = (card: PortfolioShowcaseCard, target: 'productLine' | 'otoscope') => {
    const updated = { ...card, is_active: !card.is_active }
    if (target === 'productLine') {
      saveProductLineCard(updated)
      setPortfolioCards(getStoredProductLineCards())
    } else {
      saveOtoscopeCard(updated)
      setOtoscopeCards(getStoredOtoscopeCards())
    }
    toast.success(`Card is now ${updated.is_active ? 'Active' : 'Draft'}`)
  }

  // ── Image & Icon File Upload Handlers ──
  const handleCardImageFile = async (file: File) => {
    if (!file) return
    setIsCardImageUploading(true)
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
          setCardFormData((prev) => ({ ...prev, image: data.url }))
          toast.success('Card image uploaded!')
          setIsCardImageUploading(false)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setCardFormData((prev) => ({ ...prev, image: b64 }))
        setIsCardImageUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Image upload failed')
      setIsCardImageUploading(false)
    }
  }

  const handleCardIconFile = async (file: File) => {
    if (!file) return
    setIsCardIconUploading(true)
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
          setCardFormData((prev) => ({ ...prev, badgeIcon: data.url }))
          toast.success('Badge icon uploaded!')
          setIsCardIconUploading(false)
          return
        }
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const b64 = e.target?.result as string
        setCardFormData((prev) => ({ ...prev, badgeIcon: b64 }))
        setIsCardIconUploading(false)
      }
      reader.readAsDataURL(file)
    } catch {
      toast.error('Icon upload failed')
      setIsCardIconUploading(false)
    }
  }

  // ── Reset Defaults Handlers ──
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
    toast.success('Product Line showcase header reset to defaults!')
  }

  const handleSaveProjectDev = (e: React.FormEvent) => {
    e.preventDefault()
    saveProjectDev(projectDev)
    toast.success('Project Development section updated successfully!')
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
    toast.success('Precision Manufacturing & Quality Control updated successfully!')
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
              Homepage Showcase &amp; Categories
            </h1>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Manage Portfolio Showcase (ss 2) and Otoscope &amp; Diagnostics Showcase (ss 3) cards, direct uploads &amp; actions.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap bg-zinc-200/80 p-1 rounded-2xl gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('productLine')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'productLine'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            1. Portfolio Showcase (ss 2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('otoscopeShowcase')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'otoscopeShowcase'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            2. Otoscope Showcase (ss 3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('projectDev')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'projectDev'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            3. Project Dev
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('precisionMfg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'precisionMfg'
                ? 'bg-white text-[#081022] shadow-sm'
                : 'text-zinc-600 hover:text-black'
            }`}
          >
            4. Precision Mfg &amp; QC
          </button>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── TAB 1: Complete Product Line (Portfolio Showcase ss 2)── */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'productLine' && (
        <div className="space-y-8">
          {/* Header Form */}
          <form
            onSubmit={handleSaveProductLineHeader}
            className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h2 className="text-sm font-black text-[#081022]">
                  Section Header Settings (ss 2 Top)
                </h2>
                <p className="text-xs text-zinc-500">
                  Controls the eyebrow tag, heading, and subtitle displayed above the sliding cards.
                </p>
              </div>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold rounded-xl shadow cursor-pointer transition"
              >
                <Save className="w-3.5 h-3.5" />
                Save Header
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-xs font-bold text-[#081022]">Eyebrow Badge Tag</label>
                <input
                  type="text"
                  value={productLine.eyebrow || 'Portfolio Showcase'}
                  onChange={(e) => setProductLine({ ...productLine, eyebrow: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Portfolio Showcase"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-bold text-[#081022]">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={productLine.subtitle}
                  onChange={(e) => setProductLine({ ...productLine, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none"
                  placeholder="Advanced Laryngoscopes Designed For Safe, Reliable, And Controlled Airway Management..."
                />
              </div>
            </div>
          </form>

          {/* Cards / Categories List for SS 2 */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <h3 className="text-base font-black text-[#081022]">
                    Showcase Category Cards (SS 2)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#F6851F] text-[11px] font-bold">
                    {portfolioCards.length} Cards
                  </span>
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  These cards match the Micromar-style sliding cards in ss 2. Edit, delete, reorder, or upload visuals directly from your device gallery.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddCard('productLine')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Showcase Card</span>
              </button>
            </div>

            {/* Cards rendering */}
            <div className="grid grid-cols-1 gap-4">
              {portfolioCards.length === 0 ? (
                <div className="p-10 text-center bg-white rounded-2xl border border-zinc-200 text-zinc-400">
                  <p className="text-xs font-bold text-zinc-600">No cards configured yet</p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Click &quot;Add Showcase Card&quot; to create a new card.
                  </p>
                </div>
              ) : (
                portfolioCards.map((card, index) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-xs hover:border-[#F6851F]/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Thumbnail with overlay icon badge */}
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                        <Image
                          src={card.image || '/Rectangle 819 (1).svg'}
                          alt={card.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          {card.indexLabel || `0${index + 1} / 0${portfolioCards.length}`}
                        </div>
                        {/* Circular badge preview */}
                        <div
                          className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center p-1 shadow ${
                            card.badgeBg?.includes('white')
                              ? 'bg-white border border-zinc-200'
                              : 'bg-[#F6851F]'
                          }`}
                        >
                          <Image
                            src={card.badgeIcon || '/laryngoscope 2.svg'}
                            alt="icon"
                            width={14}
                            height={14}
                            unoptimized
                            className={card.badgeBg?.includes('white') ? '' : 'brightness-0 invert'}
                          />
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-2 py-0.5 rounded-full border border-[#F6851F]/20">
                            {card.tag}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-[#081022]">{card.title}</h4>
                        <p className="text-xs text-zinc-500 line-clamp-1">{card.subtitle}</p>
                        <div className="text-[11px] text-zinc-400 pt-0.5">
                          Button: <strong className="text-zinc-700">{card.buttonText}</strong> ({card.buttonLink})
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      {/* Move Up / Down */}
                      <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleMoveCard(card.id, 'up', 'productLine')}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveCard(card.id, 'down', 'productLine')}
                          disabled={index === portfolioCards.length - 1}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Active toggle */}
                      <button
                        type="button"
                        onClick={() => handleToggleCardActive(card, 'productLine')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          card.is_active !== false
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                        }`}
                      >
                        {card.is_active !== false ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{card.is_active !== false ? 'Active' : 'Draft'}</span>
                      </button>

                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditCard(card, 'productLine')}
                        className="p-2 rounded-xl text-zinc-600 hover:text-[#081022] hover:bg-zinc-100 border border-zinc-200 transition cursor-pointer"
                        title="Edit Card"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(card.id, card.title, 'productLine')}
                        className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition cursor-pointer"
                        title="Delete Card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── TAB 2: Otoscope & Diagnostics Showcase (ss 3) ──────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'otoscopeShowcase' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-base font-black text-[#081022]">
                  Complete Product Line / Otoscope Showcase (SS 3)
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold">
                  {otoscopeCards.length} Cards
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Manage the diagnostic instruments and otoscope showcase cards shown in Section 10 on the homepage (ss 3).
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenAddCard('otoscope')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#081022] hover:bg-[#F6851F] text-white text-xs font-bold transition shadow-md cursor-pointer self-start sm:self-auto shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Diagnostic Card</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {otoscopeCards.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-zinc-200 text-zinc-400">
                <p className="text-xs font-bold text-zinc-600">No diagnostic cards configured</p>
                <p className="text-[11px] text-zinc-400 mt-1">Click &quot;Add Diagnostic Card&quot; to create one.</p>
              </div>
            ) : (
              otoscopeCards.map((card, index) => (
                <div
                  key={card.id}
                  className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-xs hover:border-[#F6851F]/50 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 flex-1">
                    {/* Thumbnail */}
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-zinc-100 border border-zinc-200 shrink-0">
                      <Image
                        src={card.image || '/Rectangle 839.svg'}
                        alt={card.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                        {card.indexLabel || `0${index + 1} / 0${otoscopeCards.length}`}
                      </div>
                      <div
                        className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center p-1 shadow ${
                          card.badgeBg?.includes('white')
                            ? 'bg-white border border-zinc-200'
                            : 'bg-[#F6851F]'
                        }`}
                      >
                        <Image
                          src={card.badgeIcon || '/Diagnostics 2.svg'}
                          alt="icon"
                          width={14}
                          height={14}
                          unoptimized
                          className={card.badgeBg?.includes('white') ? '' : 'brightness-0 invert'}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          {card.tag}
                        </span>
                      </div>
                      <h4 className="text-base font-black text-[#081022]">{card.title}</h4>
                      <p className="text-xs text-zinc-500 line-clamp-1">{card.subtitle}</p>
                      <div className="text-[11px] text-zinc-400 pt-0.5">
                        Button: <strong className="text-zinc-700">{card.buttonText}</strong> ({card.buttonLink})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <div className="flex items-center border border-zinc-200 rounded-xl bg-zinc-50 p-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveCard(card.id, 'up', 'otoscope')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCard(card.id, 'down', 'otoscope')}
                        disabled={index === otoscopeCards.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCardActive(card, 'otoscope')}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        card.is_active !== false
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-zinc-100 text-zinc-500 border border-zinc-200 hover:bg-zinc-200'
                      }`}
                    >
                      {card.is_active !== false ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{card.is_active !== false ? 'Active' : 'Draft'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditCard(card, 'otoscope')}
                      className="p-2 rounded-xl text-zinc-600 hover:text-[#081022] hover:bg-zinc-100 border border-zinc-200 transition cursor-pointer"
                      title="Edit Card"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteCard(card.id, card.title, 'otoscope')}
                      className="p-2 rounded-xl text-red-500 hover:text-red-700 hover:bg-red-50 border border-zinc-200 transition cursor-pointer"
                      title="Delete Card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── CARD EDIT / CREATE MODAL (WITH UPLOAD PLACEHOLDERS) ── */}
      {/* ────────────────────────────────────────────────────────── */}
      {isCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-zinc-100 my-8">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <div>
                <h3 className="text-xl font-black text-[#081022]">
                  {editingCard ? 'Edit Showcase Card' : 'Add New Showcase Card'}
                </h3>
                <p className="text-xs text-zinc-500">
                  {cardModalTarget === 'productLine'
                    ? 'Portfolio Showcase Card (ss 2)'
                    : 'Otoscope & Diagnostics Card (ss 3)'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCardModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-800 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCard} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Card Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={cardFormData.title}
                    onChange={(e) => setCardFormData({ ...cardFormData, title: e.target.value })}
                    placeholder="e.g. Laryngoscopes or Pocket Otoscopes"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs font-bold focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Pill Tag</label>
                  <input
                    type="text"
                    value={cardFormData.tag}
                    onChange={(e) => setCardFormData({ ...cardFormData, tag: e.target.value })}
                    placeholder="e.g. Reusable & Disposable Airway Management"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Card Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  value={cardFormData.subtitle}
                  onChange={(e) => setCardFormData({ ...cardFormData, subtitle: e.target.value })}
                  placeholder="Advanced German stainless steel blades and handles engineered for safe, controlled intubation..."
                  className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                />
              </div>

              {/* ── Card Image Placeholder & Upload ── */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#081022] uppercase tracking-wide">
                    Card Instrument Image Placeholder &amp; Gallery Upload *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCardImageManualUrl(!showCardImageManualUrl)}
                    className="text-[11px] text-[#F6851F] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Link2 className="w-3 h-3" />
                    {showCardImageManualUrl ? 'Hide URL' : 'Or Enter URL'}
                  </button>
                </div>

                {showCardImageManualUrl && (
                  <input
                    type="text"
                    value={cardFormData.image}
                    onChange={(e) => setCardFormData({ ...cardFormData, image: e.target.value })}
                    placeholder="/Rectangle 819 (1).svg or https://..."
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:border-[#F6851F]"
                  />
                )}

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  <div className="sm:col-span-4 relative aspect-[16/10] rounded-xl bg-white border-2 border-dashed border-zinc-300 overflow-hidden flex items-center justify-center p-2 shadow-inner">
                    {cardFormData.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={cardFormData.image}
                          alt="Card preview"
                          fill
                          unoptimized
                          className="object-cover rounded-lg"
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
                      setIsCardImageDragOver(true)
                    }}
                    onDragLeave={() => setIsCardImageDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setIsCardImageDragOver(false)
                      if (e.dataTransfer.files?.[0]) handleCardImageFile(e.dataTransfer.files[0])
                    }}
                    onClick={() => cardImageInputRef.current?.click()}
                    className={`sm:col-span-8 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[100px] ${
                      isCardImageDragOver
                        ? 'border-[#F6851F] bg-orange-50/70'
                        : 'border-zinc-300 hover:border-[#F6851F] bg-white'
                    }`}
                  >
                    <input
                      ref={cardImageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleCardImageFile(e.target.files[0])
                      }}
                      className="hidden"
                    />

                    <div className="w-8 h-8 rounded-full bg-[#F6851F]/10 flex items-center justify-center text-[#F6851F] mb-1">
                      {isCardImageUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UploadCloud className="w-4 h-4" />
                      )}
                    </div>
                    <p className="text-xs font-bold text-zinc-800">
                      {isCardImageUploading ? 'Uploading Image...' : 'Click or Drag & Drop Card Image'}
                    </p>
                    <p className="text-[10px] text-zinc-500 mt-0.5">Direct upload from device gallery</p>
                  </div>
                </div>
              </div>

              {/* ── Card Badge Icon & Background ── */}
              <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#081022] uppercase tracking-wide">
                    Circular Icon Badge Placeholder &amp; Upload
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowCardIconManualUrl(!showCardIconManualUrl)}
                    className="text-[11px] text-[#F6851F] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Link2 className="w-3 h-3" />
                    {showCardIconManualUrl ? 'Hide URL' : 'Or Enter Icon URL'}
                  </button>
                </div>

                {showCardIconManualUrl && (
                  <input
                    type="text"
                    value={cardFormData.badgeIcon}
                    onChange={(e) =>
                      setCardFormData({ ...cardFormData, badgeIcon: e.target.value })
                    }
                    placeholder="/laryngoscope 2.svg or /Diagnostics 2.svg"
                    className="w-full px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-mono bg-white focus:outline-none focus:border-[#F6851F]"
                  />
                )}

                <div className="flex items-center gap-4">
                  {/* Circle preview */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center p-2 shadow shrink-0 ${
                      cardFormData.badgeBg?.includes('white')
                        ? 'bg-white border border-zinc-200'
                        : 'bg-[#F6851F]'
                    }`}
                  >
                    <Image
                      src={cardFormData.badgeIcon || '/laryngoscope 2.svg'}
                      alt="Badge Icon"
                      width={24}
                      height={24}
                      unoptimized
                      className={`object-contain ${
                        cardFormData.badgeBg?.includes('white') ? '' : 'brightness-0 invert'
                      }`}
                    />
                  </div>

                  {/* Icon Upload Button & Presets */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => cardIconInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg border border-zinc-300 text-xs font-bold hover:bg-zinc-50 flex items-center gap-1.5 cursor-pointer bg-white"
                      >
                        {isCardIconUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5 text-[#F6851F]" />
                        )}
                        <span>Upload Icon SVG/PNG</span>
                      </button>
                      <input
                        ref={cardIconInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) handleCardIconFile(e.target.files[0])
                        }}
                        className="hidden"
                      />

                      <div className="flex items-center gap-1 text-[11px] text-zinc-500">
                        <span>Badge Bg:</span>
                        <button
                          type="button"
                          onClick={() => setCardFormData({ ...cardFormData, badgeBg: 'bg-white/95' })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                            cardFormData.badgeBg?.includes('white')
                              ? 'bg-white border-zinc-900 text-zinc-900'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                          }`}
                        >
                          White
                        </button>
                        <button
                          type="button"
                          onClick={() => setCardFormData({ ...cardFormData, badgeBg: 'bg-[#F6851F]' })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                            cardFormData.badgeBg?.includes('F6851F')
                              ? 'bg-[#F6851F] border-[#F6851F] text-white'
                              : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                          }`}
                        >
                          Orange
                        </button>
                      </div>
                    </div>

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-zinc-400">Presets:</span>
                      {[
                        { label: 'Laryngoscope', icon: '/laryngoscope 2.svg' },
                        { label: 'Diagnostics', icon: '/Diagnostics 2.svg' },
                        { label: 'LED Light', icon: '/LED Illumination-icon 1.svg' },
                        { label: 'Precision', icon: '/Precision Engineering-icon 1.svg' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() =>
                            setCardFormData({ ...cardFormData, badgeIcon: preset.icon })
                          }
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border cursor-pointer ${
                            cardFormData.badgeIcon === preset.icon
                              ? 'bg-[#081022] text-white border-[#081022]'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Button Text & Link ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={cardFormData.buttonText}
                    onChange={(e) =>
                      setCardFormData({ ...cardFormData, buttonText: e.target.value })
                    }
                    placeholder="Meet The Laryngoscopes Line"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Button Link URL</label>
                  <input
                    type="text"
                    value={cardFormData.buttonLink}
                    onChange={(e) =>
                      setCardFormData({ ...cardFormData, buttonLink: e.target.value })
                    }
                    placeholder="/products?category=laryngoscopes"
                    className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cardFormData.is_active !== false}
                    onChange={(e) =>
                      setCardFormData({ ...cardFormData, is_active: e.target.checked })
                    }
                    className="rounded text-[#F6851F] focus:ring-[#F6851F]"
                  />
                  <span className="text-xs font-bold text-zinc-700">Display this card immediately (Active)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsCardModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#F6851F] hover:bg-[#e07516] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── TAB 3: Project Development ─────────────────────────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'projectDev' && (
        <form onSubmit={handleSaveProjectDev} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── TAB 4: Precision Manufacturing & Quality Control ───── */}
      {/* ────────────────────────────────────────────────────────── */}
      {activeTab === 'precisionMfg' && (
        <form onSubmit={handleSavePrecisionMfg} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                  className="w-full px-3.5 py-2 text-xs border border-zinc-300 rounded-xl focus:border-[#F6851F] focus:outline-none font-mono"
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
                          className="px-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:border-[#F6851F] focus:outline-none font-mono"
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
                  Live Preview
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
