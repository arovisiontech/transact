'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { X, Send, CheckCircle2, ShieldCheck } from 'lucide-react'
import { submitInquiry } from '@/src/lib/dataStore'
import { ProductItem } from '@/src/types'

interface InquiryModalProps {
  product: ProductItem | null
  isOpen: boolean
  onClose: () => void
}

export default function InquiryModal({ product, isOpen, onClose }: InquiryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    quantity: 10,
    notes: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen || !product) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email) return

    setIsSubmitting(true)
    try {
      await submitInquiry({
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company_name: formData.company,
        country: formData.country,
        subject: `Direct Inquiry: ${product.title} (SKU: ${product.sku || 'N/A'})`,
        message: `Quantity: ${formData.quantity}\nRequirements: ${formData.notes || 'Standard OEM Specifications'}`,
        product_id: product.id,
        product_title: product.title,
        product_sku: product.sku || undefined,
        quantity: formData.quantity,
      })
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#081022] text-white">
          <div>
            <h4 className="text-base font-bold">Request Product Quotation</h4>
            <p className="text-xs text-zinc-400">Direct factory pricing from Transact International</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h5 className="text-lg font-bold text-[#081022]">Inquiry Dispatched!</h5>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                Our export sales manager will reach out with customized specifications and volume pricing for {product.title}.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-2 bg-[#F6851F] text-white rounded-xl text-xs font-semibold hover:bg-[#E07314] transition"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-[#FAFAFC] rounded-xl border border-zinc-100">
                <div className="w-14 h-14 bg-white rounded-lg relative overflow-hidden border border-zinc-200 shrink-0">
                  <Image
                    src={product.featured_image || '/images/transact/image5_3812_2.jpg'}
                    alt={product.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-semibold text-[#F6851F]">{product.category_name}</span>
                  <h6 className="text-sm font-bold text-[#081022] truncate">{product.title}</h6>
                  <p className="text-xs text-zinc-500">SKU: {product.sku || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    placeholder="Dr. Sarah Jenkins"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    placeholder="sarah@medgroup.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Estimated Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Destination Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F]"
                    placeholder="United States, UK, etc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">Custom Notes / Packaging Requirements</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Need private label marking, sterilization pouching, or material certification..."
                  className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F6851F] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ISO 13485:2016 & CE Mark Certified • Fast International Air/Sea Shipping</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Sending Quotation Request...' : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Submit Inquiry
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
