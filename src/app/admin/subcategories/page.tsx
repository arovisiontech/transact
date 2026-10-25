'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Layers, Plus, Search, Edit2, Trash2, ArrowUp, ArrowDown, CheckCircle2 } from 'lucide-react'
import { getStoredCategories, saveCategory } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types'

export default function AdminSubcategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setCategories(getStoredCategories())
  }, [])

  const showNotice = (msg: string) => {
    setNotice(msg)
    setTimeout(() => setNotice(''), 3000)
  }

  // Filter subcategories (categories with parent_id != null, or level > 0)
  const subcategories = categories.filter((c) => c.parent_id !== null && c.parent_id !== undefined)
  const displayItems = subcategories.length > 0 ? subcategories : categories.slice(10, 30)

  const filtered = displayItems.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Subcategories & Product Divisions
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Manage granular instrument groups under parent surgical specialties.
          </p>
        </div>

        <Link
          href="/admin/categories"
          className="px-5 py-2.5 bg-[#081022] hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2"
        >
          <Layers className="w-4 h-4" />
          <span>Specialty Categories View</span>
        </Link>
      </div>

      {notice && (
        <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAFC] border-b border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="px-5 py-3.5">Subcategory Name</th>
                <th className="px-5 py-3.5">Slug</th>
                <th className="px-5 py-3.5">Parent Category</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#FAFAFC] transition">
                  <td className="px-5 py-3.5 font-bold text-[#081022]">{item.name}</td>
                  <td className="px-5 py-3.5 font-mono text-zinc-500">/{item.slug}</td>
                  <td className="px-5 py-3.5 text-zinc-600">{item.parent_name || 'Surgical Instruments'}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href={`/categories/${item.slug}`}
                      target="_blank"
                      className="text-xs text-[#F6851F] font-bold hover:underline"
                    >
                      View on Store →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
