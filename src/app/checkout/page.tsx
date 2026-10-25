'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Send,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Building2,
  Globe,
} from 'lucide-react'
import { getQuoteCart, updateQuoteCartQuantity, clearQuoteCart, submitInquiry } from '@/src/lib/dataStore'
import { QuoteCartItem } from '@/src/types'

export default function CheckoutPage() {
  const [items, setItems] = useState<QuoteCartItem[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    setItems(getQuoteCart())
  }, [])

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
        country: `${formData.country} (${formData.city || 'N/A'})`,
        subject: `Institutional RFQ Order Submission - ${items.length} Products`,
        message: `Items List:\n${itemsList}\n\nClient Notes:\n${formData.notes || 'None'}`,
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
    <PublicShell>
      {/* Hero */}
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Institutional Procurement
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Institutional RFQ Cart & Order Submission
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl">
            Review your selected surgical procedure instruments and submit for official FOB/CIF quotation.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto">
          {isSuccess ? (
            <div className="max-w-xl mx-auto py-16 bg-white rounded-3xl border border-zinc-200 p-8 sm:p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-[#081022]">Institutional RFQ Dispatched!</h2>
              <p className="text-sm text-[#4B5D71] leading-relaxed">
                Thank you for your procurement inquiry. Your instrument specifications have been transmitted to our export sales team. A formal proforma quotation and delivery schedule will be sent to <span className="font-semibold text-[#081022]">{formData.email}</span> within 24 hours.
              </p>
              <div className="pt-4">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow"
                >
                  Return to Instrument Catalog
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="max-w-md mx-auto py-20 bg-white rounded-3xl border border-zinc-200 p-8 text-center space-y-3 shadow-sm">
              <div className="w-16 h-16 bg-zinc-100 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#081022]">Your RFQ Cart is Empty</h3>
              <p className="text-xs text-[#4B5D71]">
                You have not selected any instruments yet. Browse our specialty catalog to add tools for institutional quotation.
              </p>
              <div className="pt-3">
                <Link
                  href="/products"
                  className="inline-block px-5 py-2.5 bg-[#F6851F] text-white text-xs font-bold rounded-xl shadow"
                >
                  Explore Instruments
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Items List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <h3 className="text-base font-bold text-[#081022]">
                      Selected Instruments ({items.length})
                    </h3>
                    <button
                      onClick={() => {
                        clearQuoteCart()
                        setItems([])
                      }}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Empty Cart
                    </button>
                  </div>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFAFC] border border-zinc-100"
                      >
                        <div className="w-16 h-16 bg-white rounded-xl relative overflow-hidden border border-zinc-200 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] font-bold text-[#F6851F] uppercase">{item.category}</span>
                          <h4 className="text-sm font-bold text-[#081022] truncate">{item.title}</h4>
                          <span className="text-xs text-zinc-500 font-mono">Ref: {item.sku}</span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 bg-white border border-zinc-200 rounded-xl p-1">
                          <button
                            onClick={() => handleQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-zinc-100 rounded text-zinc-500"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-[#081022]">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-zinc-100 rounded text-zinc-500"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item.id)}
                          className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#081022] hover:text-[#F6851F] transition"
                >
                  <ArrowLeft className="w-4 h-4" /> Add More Surgical Instruments
                </Link>
              </div>

              {/* Right Column: Hospital Details & Submission */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-8 shadow-sm space-y-5">
                  <div>
                    <h3 className="text-lg font-bold text-[#081022]">Hospital & Procurement Details</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Please provide shipping destination to receive accurate freight estimates.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Michael Chang"
                        className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Official Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="procurement@hospital.org"
                        className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+1 (555) 019-2834"
                          className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Institution Name</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="General Hospital"
                          className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">Country *</label>
                        <input
                          type="text"
                          required
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="United States"
                          className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">City / Port of Entry</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Chicago / JFK"
                          className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Special Packaging / Laser Marking</label>
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="E.g. custom sterile pouching, UDI laser engraving, or specific delivery deadline..."
                        className="w-full text-xs p-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F] resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Certified ISO 13485:2016 Manufacturer Guarantee</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-sm rounded-xl transition shadow-lg shadow-[#F6851F]/20 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        'Transmitting RFQ...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Submit Institutional RFQ
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicShell>
  )
}
