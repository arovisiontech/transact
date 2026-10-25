'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  X,
  Save,
  BookOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import Image from 'next/image'
import { CatalogueItem } from '@/src/types'
import { saveCatalogue } from '@/src/lib/dataStore'

interface CatalogueModalProps {
  catalogue: CatalogueItem | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const PRESET_COVERS = [
  { label: 'Laryngoscope Cover', url: '/images/catalogues/laryngoscope-cover.webp' },
  { label: 'Diagnostics Cover', url: '/images/catalogues/diagnostics-cover.webp' },
  { label: 'Company Profile Cover', url: '/images/catalogues/company-profile-cover.webp' },
]

export default function CatalogueModal({
  catalogue,
  isOpen,
  onClose,
  onSaved,
}: CatalogueModalProps) {
  const [formData, setFormData] = useState<Partial<CatalogueItem>>({
    title: '',
    catalog_number: 'CATALOG 01',
    category: 'LARYNGOSCOPE',
    description: '',
    pdf_url: '/catalogues/Artery-Forceps-Section4.pdf',
    cover_image: '/images/catalogues/laryngoscope-cover.webp',
    pages: 48,
    file_size: '3.5 MB',
    is_published: true,
    sort_order: 1,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)
  const [previewPdfOpen, setPreviewPdfOpen] = useState(false)

  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (catalogue) {
      setFormData({ ...catalogue })
    } else {
      setFormData({
        id: `alpha-cat-${Date.now()}`,
        title: '',
        catalog_number: 'CATALOG 01',
        category: 'LARYNGOSCOPE',
        description:
          'Our Laryngoscope Range Is Engineered To Support Safe, Efficient, And Dependable Airway Management. Manufactured With Precision-Grade Materials And Advanced Optical Technology, Each Instrument Delivers Excellent Illumination, Smooth Handling, And Consistent Performance For Healthcare Professionals.',
        pdf_url: '/catalogues/Artery-Forceps-Section4.pdf',
        cover_image: '/images/catalogues/laryngoscope-cover.webp',
        pages: 48,
        file_size: '3.5 MB',
        is_published: true,
        sort_order: 1,
      })
    }
    setUploadMessage(null)
    setPreviewPdfOpen(false)
  }, [catalogue, isOpen])

  if (!isOpen) return null

  // Direct file upload for PDF
  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingPdf(true)
    setUploadMessage('Uploading PDF catalogue...')

    try {
      const data = new FormData()
      data.append('file', file)
      data.append('folder', 'catalogues')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (result.success && result.url) {
        setFormData((prev) => ({
          ...prev,
          pdf_url: result.url,
          file_size: result.size || prev.file_size,
        }))
        setUploadMessage(`PDF uploaded successfully (${result.size})!`)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (err: any) {
      console.error(err)
      setUploadMessage(`Upload error: ${err.message}. Using direct path.`)
    } finally {
      setIsUploadingPdf(false)
      setTimeout(() => setUploadMessage(null), 4000)
    }
  }

  // Direct file upload for Cover Image
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingCover(true)
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('folder', 'images/catalogues')

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      })

      const result = await res.json()
      if (result.success && result.url) {
        setFormData((prev) => ({
          ...prev,
          cover_image: result.url,
        }))
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsUploadingCover(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title) return

    setIsSaving(true)
    try {
      const itemToSave: CatalogueItem = {
        id: formData.id || `alpha-cat-${Date.now()}`,
        title: formData.title.trim(),
        catalog_number: formData.catalog_number?.trim() || 'CATALOG 01',
        category: formData.category?.trim() || 'General',
        category_id: `cat-${formData.category?.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        description: formData.description || null,
        pdf_url: formData.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf',
        cover_image: formData.cover_image || '/images/catalogues/laryngoscope-cover.webp',
        pages: Number(formData.pages) || 48,
        file_size: formData.file_size || '3.5 MB',
        is_published: Boolean(formData.is_published),
        sort_order: Number(formData.sort_order) || 1,
      }

      await saveCatalogue(itemToSave)
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F6851F]/20 border border-[#F6851F]/40 flex items-center justify-center text-[#F6851F]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {catalogue ? 'Edit Product Catalogue' : 'Upload High-Resolution Catalogue'}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Upload PDFs of any size with cover graphics & live viewing.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {uploadMessage && (
          <div className="px-6 py-2.5 bg-blue-50 border-b border-blue-100 text-blue-900 text-xs font-semibold flex items-center gap-2 shrink-0">
            {isUploadingPdf ? (
              <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            )}
            <span>{uploadMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title & Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#081022] mb-1">
                Catalogue Title *
              </label>
              <input
                type="text"
                required
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. LARYNGOSCOPE, DIAGNOSTICS"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">
                Reference Badge
              </label>
              <input
                type="text"
                value={formData.catalog_number || ''}
                onChange={(e) => setFormData({ ...formData, catalog_number: e.target.value })}
                placeholder="CATALOG 01"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="LARYNGOSCOPE / DIAGNOSTICS / COMPANY PROFILE"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#081022]">
                <input
                  type="checkbox"
                  checked={Boolean(formData.is_published)}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded text-[#F6851F] focus:ring-[#F6851F] w-4 h-4"
                />
                <span>Published on Website</span>
              </label>
            </div>
          </div>

          {/* PDF File Upload Section */}
          <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F6851F]" />
                <span className="text-xs font-bold text-[#081022]">PDF Document</span>
              </div>
              {formData.pdf_url && (
                <button
                  type="button"
                  onClick={() => setPreviewPdfOpen(!previewPdfOpen)}
                  className="text-xs font-bold text-[#F6851F] hover:text-[#E07314] flex items-center gap-1 transition"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{previewPdfOpen ? 'Hide Preview' : 'View Catalog PDF'}</span>
                </button>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={pdfInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={handlePdfFileChange}
            />

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isUploadingPdf}
                className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold text-[#081022] flex items-center justify-center gap-2 transition shadow-sm shrink-0"
              >
                {isUploadingPdf ? (
                  <Loader2 className="w-4 h-4 text-[#F6851F] animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 text-[#F6851F]" />
                )}
                <span>{isUploadingPdf ? 'Uploading...' : 'Choose PDF File'}</span>
              </button>

              <div className="flex-1 w-full min-w-0">
                <input
                  type="text"
                  value={formData.pdf_url || ''}
                  onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                  placeholder="/catalogues/Artery-Forceps-Section4.pdf or https://..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-zinc-200 font-mono text-zinc-600 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            </div>

            {/* In-Modal PDF Live Viewer */}
            {previewPdfOpen && formData.pdf_url && (
              <div className="mt-3 rounded-2xl overflow-hidden border border-zinc-300 bg-zinc-900 shadow-inner">
                <div className="px-3 py-1.5 bg-zinc-800 text-white text-[10px] flex items-center justify-between">
                  <span>Live PDF Preview</span>
                  <a
                    href={formData.pdf_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#F6851F] hover:underline"
                  >
                    Open in New Window
                  </a>
                </div>
                <iframe
                  src={formData.pdf_url}
                  className="w-full h-72 border-none"
                  title="PDF Preview"
                />
              </div>
            )}
          </div>

          {/* Cover Graphic Selection & Upload */}
          <div className="p-4 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#F6851F]" />
                <span className="text-xs font-bold text-[#081022]">3D Cover Graphic</span>
              </div>
              <span className="text-[10px] text-zinc-400">High-Resolution Mockup</span>
            </div>

            {/* Presets */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Quick Select 3D Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.url}
                    type="button"
                    onClick={() => setFormData({ ...formData, cover_image: preset.url })}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      formData.cover_image === preset.url
                        ? 'bg-[#081022] text-white border-[#081022]'
                        : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#F6851F]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom upload */}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverFileChange}
            />

            <div className="flex items-center gap-3">
              <div className="w-16 h-20 rounded-xl bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                {formData.cover_image ? (
                  <Image
                    src={formData.cover_image}
                    alt="Cover preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="px-3.5 py-1.5 bg-white hover:bg-zinc-50 border border-zinc-300 rounded-xl text-xs font-bold text-[#081022] flex items-center gap-1.5 transition shadow-sm"
                >
                  {isUploadingCover ? (
                    <Loader2 className="w-3.5 h-3.5 text-[#F6851F] animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-[#F6851F]" />
                  )}
                  <span>Upload Custom Cover</span>
                </button>
                <input
                  type="text"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="/images/catalogues/..."
                  className="w-full text-xs px-3 py-1.5 rounded-xl bg-white border border-zinc-200 font-mono text-zinc-600 focus:outline-none focus:border-[#F6851F]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">
              Description Text
            </label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the instruments included in this catalog edition..."
              className="w-full text-xs p-3 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] leading-relaxed"
            />
          </div>

          {/* Pages & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">Total Pages</label>
              <input
                type="number"
                value={formData.pages || 48}
                onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#081022] mb-1">File Size</label>
              <input
                type="text"
                value={formData.file_size || '3.5 MB'}
                onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingPdf}
              className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving Catalogue...' : 'Save Catalogue'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
