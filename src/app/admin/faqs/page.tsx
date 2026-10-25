'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  HelpCircle,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  X,
  Save,
  Loader2,
} from 'lucide-react'
import { getStoredFaqs, saveFaq, deleteFaq } from '@/src/lib/dataStore'
import { FaqItem } from '@/src/types'

const CATEGORY_PRESETS = [
  'General & Payments',
  'Quality & Certifications',
  'OEM & Custom Manufacturing',
  'Orders & Shipping',
  'Warranty & Sterilization',
]

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [modalItem, setModalItem] = useState<FaqItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const reloadData = async () => {
    try {
      const res = await fetch('/api/faqs', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setFaqs(data)
          return
        }
      }
    } catch {
      // Fallback
    }
    setFaqs(getStoredFaqs())
  }

  useEffect(() => {
    reloadData()
  }, [])

  const showNotice = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  const handleDelete = async (faq: FaqItem) => {
    if (!confirm(`Delete question: "${faq.question}"?`)) return
    await deleteFaq(faq.id)
    await reloadData()
    showNotice('FAQ deleted successfully!')
  }

  const categories = ['ALL', ...Array.from(new Set(faqs.map((f) => f.category || 'General')))]

  const filtered = faqs.filter((f) => {
    const matchesSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      selectedCategory === 'ALL' || (f.category || 'General') === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB] px-2.5 py-0.5 rounded-full border border-[#F6851F]/30">
              Customer Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022] mt-1">
            FAQ Management
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Add, edit, and organize frequently asked questions for your clients worldwide.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Link
            href="/faq"
            target="_blank"
            className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-[#081022] font-bold text-xs rounded-xl border border-zinc-300 transition shadow-sm flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4 text-[#F6851F]" />
            <span>View Public FAQ</span>
          </Link>
          <button
            onClick={() => {
              setModalItem(null)
              setIsModalOpen(true)
            }}
            className="px-5 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New FAQ</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQs by question or answer..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                selectedCategory === cat
                  ? 'bg-[#081022] text-white border-[#081022]'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#F6851F]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Question & Answer</th>
                <th className="px-5 py-3.5 w-48">Category</th>
                <th className="px-5 py-3.5 text-right w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((faq) => (
                <tr key={faq.id} className="hover:bg-[#FAFAFC] transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-[#081022] text-sm">{faq.question}</p>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed line-clamp-2">
                      {faq.answer}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[10px] font-bold text-zinc-700">
                      {faq.category || 'General'}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setModalItem(faq)
                          setIsModalOpen(true)
                        }}
                        title="Edit Question"
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(faq)}
                        title="Delete Question"
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

      {/* Add / Edit FAQ Modal */}
      {isModalOpen && (
        <FaqModal
          faq={modalItem}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaved={async () => {
            await reloadData()
            showNotice('FAQ saved successfully!')
          }}
        />
      )}
    </div>
  )
}

function FaqModal({
  faq,
  isOpen,
  onClose,
  onSaved,
}: {
  faq: FaqItem | null
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}) {
  const [formData, setFormData] = useState<FaqItem>({
    id: faq?.id || `faq-${Date.now()}`,
    question: faq?.question || '',
    category: faq?.category || 'General & Payments',
    answer: faq?.answer || '',
    is_published: faq?.is_published !== false,
  })
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question || !formData.answer) return

    setIsSaving(true)
    try {
      await saveFaq(formData)
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
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden">
        <div className="px-6 py-4 bg-[#081022] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-[#F6851F]" />
            <h3 className="text-base font-bold">
              {faq ? 'Edit Frequently Asked Question' : 'Add New FAQ Question'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">
              Question Title *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              placeholder="e.g. Which Surgical Specialties Do You Support?"
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Select or enter category..."
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
            {/* Quick preset chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat })}
                  className={`text-[10px] px-2.5 py-1 rounded-lg border transition ${
                    formData.category === cat
                      ? 'bg-[#081022] text-white border-[#081022]'
                      : 'bg-zinc-100 text-zinc-600 border-zinc-200 hover:border-[#F6851F]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#081022] mb-1">
              Detailed Answer *
            </label>
            <textarea
              rows={4}
              required
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              placeholder="Provide a thorough, accurate answer for healthcare professionals..."
              className="w-full text-xs p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F] leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-zinc-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{isSaving ? 'Saving...' : 'Save Question'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
