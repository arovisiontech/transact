'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  FolderOpen,
  BookOpen,
  Mail,
  Plus,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Clock,
} from 'lucide-react'
import {
  getStoredProducts,
  getStoredCategories,
  getStoredCatalogues,
  getStoredInquiries,
} from '@/src/lib/dataStore'
import { ProductItem, CategoryItem, CatalogueItem, ContactInquiryItem } from '@/src/types'
import ProductModal from '@/src/components/admin/ProductModal'

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<ProductItem[]>([])
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [catalogues, setCatalogues] = useState<CatalogueItem[]>([])
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)

  const reloadData = () => {
    setProducts(getStoredProducts())
    setCategories(getStoredCategories())
    setCatalogues(getStoredCatalogues())
    setInquiries(getStoredInquiries())
  }

  useEffect(() => {
    reloadData()
  }, [])

  const stats = [
    {
      label: 'Surgical Instruments',
      value: products.length,
      href: '/admin/products',
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Specialty Categories',
      value: categories.length,
      href: '/admin/categories',
      icon: FolderOpen,
      color: 'text-[#F6851F]',
      bg: 'bg-[#FFF4EB]',
    },
    {
      label: 'PDF Catalogues',
      value: catalogues.length,
      href: '/admin/catalogues',
      icon: BookOpen,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      label: 'RFQ Inquiries',
      value: inquiries.length,
      href: '/admin/inquiries',
      icon: Mail,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#081022]">
            Transact Executive Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#4B5D71] mt-1">
            Real-time management for catalog items, international inquiries, and technical catalogues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddProductOpen(true)}
            className="px-4 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
          <Link
            href="/admin/categories"
            className="px-4 py-2.5 bg-[#081022] hover:bg-zinc-800 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2"
          >
            <FolderOpen className="w-4 h-4" />
            <span>Manage Categories</span>
          </Link>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Link
              key={i}
              href={s.href}
              className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm transact-card flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  {s.label}
                </span>
                <p className="text-3xl font-black text-[#081022] font-mono">
                  {s.value}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <Icon className="w-7 h-7" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Inquiries & Recent Products Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent RFQ Inquiries */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#F6851F]" />
              <h2 className="text-base font-bold text-[#081022]">Recent Inquiries & RFQs</h2>
            </div>
            <Link href="/admin/inquiries" className="text-xs text-[#F6851F] font-bold hover:underline">
              View All →
            </Link>
          </div>

          {inquiries.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 space-y-2">
              <Mail className="w-8 h-8 mx-auto text-zinc-300" />
              <p className="text-xs">No pending RFQs at the moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {inquiries.slice(0, 5).map((inq) => (
                <div
                  key={inq.id}
                  className="p-4 rounded-2xl bg-[#FAFAFC] border border-zinc-100 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-[#081022] truncate">{inq.customer_name}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold uppercase">
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{inq.subject}</p>
                    <span className="text-[10px] text-zinc-400 font-mono">{inq.email}</span>
                  </div>

                  <Link
                    href="/admin/inquiries"
                    className="px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-semibold text-zinc-700 hover:text-[#F6851F] transition shrink-0"
                  >
                    Inspect
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Catalog Showcase Shortcuts */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-[#F6851F]" />
              <h2 className="text-base font-bold text-[#081022]">Featured Instruments</h2>
            </div>
            <Link href="/admin/products" className="text-xs text-[#F6851F] font-bold hover:underline">
              Full List →
            </Link>
          </div>

          <div className="space-y-3">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAFAFC] border border-zinc-100"
              >
                <div className="w-12 h-12 rounded-xl bg-white relative overflow-hidden border border-zinc-200 shrink-0 p-1">
                  <Image
                    src={prod.featured_image || '/images/transact/image5_3812_2.jpg'}
                    alt={prod.title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-[#081022] truncate">{prod.title}</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">{prod.sku || 'N/A'}</p>
                </div>
                <span className="text-xs font-bold text-[#081022] font-mono">
                  {prod.price ? `$${prod.price.toFixed(2)}` : 'RFQ'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <ProductModal
        product={null}
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSaved={reloadData}
      />
    </div>
  )
}
