'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle2,
  Eye,
  FileText,
  ExternalLink,
  X,
} from 'lucide-react'
import {
  getStoredCatalogues,
  saveCatalogue,
  deleteCatalogue,
} from '@/src/lib/dataStore'
import { CatalogueItem } from '@/src/types'
import CatalogueModal from '@/src/components/admin/CatalogueModal'

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [search, setSearch] = useState('')
  const [modalItem, setModalItem] = useState<CatalogueItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null)
  const [viewingPdfTitle, setViewingPdfTitle] = useState<string>('')

  const reloadData = async () => {
    try {
      const res = await fetch('/api/catalogues', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setCatalogues(data)
          return
        }
      }
    } catch {
      // Fallback to local
    }
    setCatalogues(getStoredCatalogues())
  }

  useEffect(() => {
    reloadData()
  }, [])

  const showNotice = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  const handleDelete = async (cat: CatalogueItem) => {
    if (!confirm(`Delete catalogue "${cat.title}"?`)) return
    await deleteCatalogue(cat.id)
    await reloadData()
    showNotice(`Deleted "${cat.title}"`)
  }

  const handleTogglePublished = async (cat: CatalogueItem) => {
    await saveCatalogue({ ...cat, is_published: !cat.is_published })
    await reloadData()
    showNotice(`Updated status for "${cat.title}"`)
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const items = [...catalogues]
    const idx = items.findIndex((c) => c.id === id)
    if (idx < 0) return
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= items.length) return

    const temp = items[idx]
    items[idx] = items[targetIdx]
    items[targetIdx] = temp

    setCatalogues(items)
    try {
      await fetch('/api/catalogues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setAll', catalogues: items }),
      })
    } catch (e) {
      console.error(e)
    }
    showNotice('Catalogue order updated')
  }

  const filtered = catalogues.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.category?.toLowerCase().includes(search.toLowerCase()) ||
      c.catalog_number?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-2.5 py-0.5 rounded-full border border-[#F6851F]/30">
              Interactive Literature
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022] mt-1">
            Product Catalogues Management
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Upload catalogues of any size without failures, manage 3D cover mockups, and preview PDFs live.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/catalogues"
            target="_blank"
            className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-[#081022] font-bold text-xs rounded-xl border border-zinc-300 transition shadow-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#F6851F]" />
            <span>View Public Page</span>
          </Link>
          <button
            onClick={() => {
              setModalItem(null)
              setIsModalOpen(true)
            }}
            className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Catalogue</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search catalogues by title or reference..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>
        <span className="text-xs text-zinc-500">
          Showing <b>{filtered.length}</b> catalogues
        </span>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5 w-16">Reorder</th>
                <th className="px-5 py-3.5">Catalogue & 3D Cover</th>
                <th className="px-5 py-3.5">Reference</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Pages & Size</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-[#FAFAFC] transition">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(cat.id, 'up')}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMove(cat.id, 'down')}
                        disabled={idx === filtered.length - 1}
                        title="Move Down"
                        className="p-1 rounded hover:bg-zinc-200 text-zinc-500 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden relative shrink-0">
                        <Image
                          src={cat.cover_image || '/images/catalogues/laryngoscope-cover.webp'}
                          alt={cat.title}
                          fill
                          unoptimized
                          className="object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-[#081022] truncate text-sm">{cat.title}</p>
                        <span className="text-[11px] text-zinc-400 font-mono truncate block max-w-xs">
                          {cat.pdf_url}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 font-mono text-zinc-700 font-bold">
                    <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[11px]">
                      {cat.catalog_number || 'CATALOG 01'}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-zinc-600 font-semibold">
                    {cat.category || 'General'}
                  </td>

                  <td className="px-5 py-3.5 text-zinc-500">
                    {cat.pages || 48} pgs • {cat.file_size || '3.5 MB'}
                  </td>

                  <td className="px-5 py-3.5 text-center">
                    <button
                      onClick={() => handleTogglePublished(cat)}
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition ${
                        cat.is_published
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {cat.is_published ? 'Active' : 'Draft'}
                    </button>
                  </td>

                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* View Catalog Button */}
                      <button
                        onClick={() => {
                          setViewingPdfUrl(cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf')
                          setViewingPdfTitle(cat.title)
                        }}
                        title="View Catalog PDF"
                        className="px-3 py-1.5 rounded-xl bg-[#FFF4EB] hover:bg-[#FFE8D6] text-[#F6851F] font-bold text-xs flex items-center gap-1.5 transition border border-[#F6851F]/20"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      <a
                        href={cat.pdf_url || '/catalogues/Artery-Forceps-Section4.pdf'}
                        download
                        title="Download PDF"
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-[#F6851F] hover:bg-zinc-100 transition"
                      >
                        <Download className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => {
                          setModalItem(cat)
                          setIsModalOpen(true)
                        }}
                        title="Edit Catalogue"
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(cat)}
                        title="Delete Catalogue"
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF Viewing Modal */}
      {viewingPdfUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-5xl h-[88vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-zinc-700">
            <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-[#F6851F]" />
                <h3 className="text-base font-bold">{viewingPdfTitle} - Live Catalog Reader</h3>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={viewingPdfUrl}
                  download
                  className="px-3 py-1.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
                <button
                  onClick={() => setViewingPdfUrl(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-zinc-900">
              <iframe
                src={viewingPdfUrl}
                className="w-full h-full border-none"
                title={viewingPdfTitle}
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Catalogue Modal */}
      <CatalogueModal
        catalogue={modalItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reloadData}
      />
    </div>
  )
}
