'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Globe,
  MessageSquare,
} from 'lucide-react'
import { submitInquiry } from '@/src/lib/dataStore'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    subject: 'Institutional RFQ / Tender Inquiry',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
        subject: formData.subject,
        message: formData.message,
      })
      setIsSuccess(true)
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = [
    { name: 'Export & Government Tenders', email: 'tenders@transactintl.com', phone: '+92 52 3550123' },
    { name: 'OEM & Contract Manufacturing', email: 'oem@transactintl.com', phone: '+92 52 3550124' },
    { name: 'Quality Assurance & Regulatory', email: 'qa@transactintl.com', phone: '+92 52 3550125' },
    { name: 'USA & North America Support', email: 'usa@transactintl.com', phone: '+1 (800) 450-8912' },
  ]

  return (
    <PublicShell>
      {/* Hero */}
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Global Communication & RFQ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact Transact International
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Direct communication with our manufacturing engineers, export specialists, and international distribution coordinators.
          </p>
        </div>
      </div>

      {/* Main Form & Info Section */}
      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">Direct Channels</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#081022]">Get in Touch with our Factory</h2>
                <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                  Our export desk responds within 24 hours with complete proforma invoices, FOB/CIF shipping quotes, and material test sheets.
                </p>
              </div>

              {/* Main Address Card */}
              <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] text-[#F6851F] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#081022]">Global Manufacturing Plant</h3>
                    <p className="text-xs text-[#4B5D71] mt-1">
                      Small Industrial Estate, Sambrial Road, Sialkot 51310, Pakistan
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-zinc-200">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] text-[#F6851F] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#081022]">North American Office</h3>
                    <p className="text-xs text-[#4B5D71] mt-1">
                      100 International Blvd, Suite 400, Chicago, IL 60601, USA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-zinc-200">
                  <div className="w-10 h-10 rounded-xl bg-[#FFF4EB] text-[#F6851F] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#081022]">Working Hours</h3>
                    <p className="text-xs text-[#4B5D71] mt-0.5">Monday - Saturday: 8:00 AM - 6:00 PM (PKT)</p>
                  </div>
                </div>
              </div>

              {/* Department Directory */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#081022]">Department Contacts</h3>
                <div className="space-y-2">
                  {departments.map((d, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#FAFAFC] border border-zinc-100 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-[#081022]">{d.name}</p>
                        <a href={`mailto:${d.email}`} className="text-[#F6851F] hover:underline text-[11px]">{d.email}</a>
                      </div>
                      <span className="font-mono text-zinc-500 text-[11px]">{d.phone}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: RFQ Form */}
            <div className="lg:col-span-7 bg-[#FAFAFC] p-8 sm:p-10 rounded-3xl border border-zinc-200 shadow-sm">
              {isSuccess ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#081022]">Message & RFQ Dispatched</h3>
                  <p className="text-sm text-[#4B5D71] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to Transact International. Your inquiry has been routed to our export sales department. An official quotation will be generated within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSuccess(false)
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        company: '',
                        country: '',
                        subject: 'Institutional RFQ / Tender Inquiry',
                        message: '',
                      })
                    }}
                    className="mt-4 px-6 py-2.5 bg-[#F6851F] text-white rounded-xl text-xs font-bold hover:bg-[#E07314] transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold text-[#081022]">Institutional RFQ Quotation Form</h2>
                    <p className="text-xs text-[#4B5D71]">
                      Fill out the form below for hospital procurement tenders, bulk distribution, or OEM contract manufacturing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Dr. Alexander Wright"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alexander@hospitalgroup.com"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Phone / WhatsApp</label>
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 234-5678"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Hospital / Organization</label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="St. Jude Healthcare Group"
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Destination Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="United States, Germany, UAE, etc."
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-700 mb-1">Inquiry Purpose</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F]"
                      >
                        <option value="Institutional RFQ / Tender Inquiry">Institutional RFQ / Tender</option>
                        <option value="OEM / Private Label Contract">OEM / Private Labeling</option>
                        <option value="Bulk Distributor Pricing">Bulk Distribution Dealership</option>
                        <option value="Custom Technical Instrumentation">Custom Instrument Design</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">Instrument List & Specifications *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please list instrument SKUs, required quantities, target delivery date, or custom laser marking requirements..."
                      className="w-full text-xs p-3.5 bg-white border border-zinc-200 rounded-xl focus:outline-none focus:border-[#F6851F] resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Your procurement data is strictly protected. ISO 13485 audited facility.</span>
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
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
