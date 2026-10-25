'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, Trash2, Plus, Minus, Send, CheckCircle2, ShieldCheck, ShoppingBag } from 'lucide-react'
import { getQuoteCart, updateQuoteCartQuantity, clearQuoteCart, submitInquiry } from '@/src/lib/dataStore'
import { QuoteCartItem } from '@/src/types'

interface CartQuoteModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartQuoteModal({ isOpen, onClose }: CartQuoteModalProps) {
  const [items, setItems] = useState<QuoteCartItem[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const reloadCart = () => {
    setItems(getQuoteCart())
  }

  useEffect(() => {
    if (isOpen) {
      reloadCart()
      setIsSuccess(false)
    }
  }, [isOpen])

  // Listen to updates from other tabs or actions
  useEffect(() => {
    const handleUpdate = () => reloadCart()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  if (!isOpen) return null

  const handleQuantity = (id: string, delta: number) => {
    const item = items.find((i) => i.id === id)
    if (!item) return
    const newQty = item.quantity + delta
    const updated = updateQuoteCartQuantity(id, newQty)
    setItems(updated)
  }

  const handleRemove = (id: string) => {
    const updated = updateQuoteCartQuantity(id, 0)
    setItems(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    setIsSubmitting(true)
    try {
      const itemsList = items.map((i) => `${i.title} (SKU: ${i.sku}) x ${i.quantity}`).join('\n')
      await submitInquiry({
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company,
        country: formData.country,
        subject: `RFQ Quote Request - ${items.length} Surgical Items`,
        message: `Customer Inquiry Items:\n${itemsList}\n\nAdditional Notes:\n${formData.notes || 'N/A'}`,
        items: items.map((i) => ({ id: i.id, title: i.title, sku: i.sku, quantity: i.quantity })),
      })

      clearQuoteCart()
      setItems([])
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-[#081022] text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F6851F]/20 flex items-center justify-center text-[#F6851F]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Request for Quote (RFQ)</h3>
              <p className="text-xs text-zinc-400">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected for institutional quote
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isSuccess ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#081022]">Quote Request Submitted!</h4>
              <p className="text-sm text-zinc-600 max-w-sm mx-auto leading-relaxed">
                Thank you for inquiring with Transact International. Our international export team will review your specifications and reply with official FOB/CIF pricing within 24 hours.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#F6851F] text-white rounded-xl font-semibold hover:bg-[#E07314] transition-all shadow-md"
              >
                Continue Browsing
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-14 h-14 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-[#081022]">Your Quote Cart is Empty</h4>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                Browse our surgical catalog and click &ldquo;Add to Quote&rdquo; to request institutional pricing.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="inline-block mt-3 px-5 py-2 bg-[#081022] text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition"
              >
                Explore Products
              </Link>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  <span>Selected Instruments</span>
                  <button
                    onClick={() => {
                      clearQuoteCart()
                      setItems([])
                    }}
                    className="text-red-500 hover:underline normal-case text-xs font-normal"
                  >
                    Clear All
                  </button>
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-[#FAFAFC] rounded-xl border border-zinc-100"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg relative overflow-hidden border border-zinc-200 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-semibold text-[#081022] truncate">{item.title}</h5>
                      <p className="text-xs text-zinc-500">{item.sku} • {item.category}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 bg-white border border-zinc-200 rounded-lg p-1">
                      <button
                        onClick={() => handleQuantity(item.id, -1)}
                        className="p-1 hover:bg-zinc-100 rounded text-zinc-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#081022]">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantity(item.id, 1)}
                        className="p-1 hover:bg-zinc-100 rounded text-zinc-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Inquiry Form */}
              <form onSubmit={handleSubmit} className="border-t border-zinc-100 pt-5 space-y-3.5">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Hospital & Institutional Contact Details
                </h5>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. John Smith"
                      className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@hospital.org"
                      className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Phone / WhatsApp</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 019-2834"
                      className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Hospital / Organization</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Apex Surgical Clinic"
                      className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    placeholder="United States, Germany, UAE, etc."
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Specific Requirements / Tender Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="E.g., custom laser etching, TC inserts, delivery timeline..."
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F] resize-none"
                  />
                </div>

                <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct OEM Manufacturer Pricing • ISO 13485 & CE Guaranteed</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full py-3 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-sm rounded-xl transition shadow-lg shadow-[#F6851F]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Transmitting Quote Request...'
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Institutional RFQ
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
