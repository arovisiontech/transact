'use client'

import React, { useState, useEffect } from 'react'
import {
  Mail,
  Search,
  CheckCircle,
  Clock,
  Trash2,
  Building,
  Phone,
  Package,
  Calendar,
  Filter,
} from 'lucide-react'
import { toast } from 'sonner'
import { ContactInquiryItem } from '@/src/types'
import {
  getStoredInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '@/src/lib/dataStore'

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiryItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null)

  const loadData = () => {
    setInquiries(getStoredInquiries())
  }

  useEffect(() => {
    loadData()
    const handleUpdate = () => loadData()
    window.addEventListener('transact_data_updated', handleUpdate)
    return () => window.removeEventListener('transact_data_updated', handleUpdate)
  }, [])

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.company_name && inq.company_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (inq.message && inq.message.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = (id: string, status: ContactInquiryItem['status']) => {
    updateInquiryStatus(id, status)
    toast.success(`Inquiry marked as ${status}`)
    loadData()
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status })
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this inquiry record permanently?')) {
      deleteInquiry(id)
      toast.success('Inquiry record deleted')
      loadData()
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null)
      }
    }
  }

  const newCount = inquiries.filter((i) => i.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <Mail className="w-4 h-4" />
            <span>Communication & B2B Leads</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl font-black text-[#081022]">RFQ Quotations & Inquiries</h1>
            {newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#F6851F] text-white text-[10px] font-black tracking-wider">
                {newCount} NEW
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Review incoming instrument quote requests, technical specifications, and client inquiries.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, clinic, or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-400 shrink-0" />
          {(['all', 'new', 'read', 'replied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                statusFilter === status
                  ? 'bg-[#081022] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: List + Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Inquiries List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">
              <Mail className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
              <p className="font-semibold text-zinc-600">No Inquiries Found</p>
              <p className="text-xs text-zinc-400 mt-1">
                {searchQuery ? 'Try clearing your search query' : 'New RFQs from clients will display here automatically.'}
              </p>
            </div>
          ) : (
            filteredInquiries.map((inq) => {
              const isSelected = selectedInquiry?.id === inq.id
              return (
                <div
                  key={inq.id}
                  onClick={() => {
                    setSelectedInquiry(inq)
                    if (inq.status === 'new') {
                      handleUpdateStatus(inq.id, 'read')
                    }
                  }}
                  className={`p-5 rounded-2xl border transition cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#F6851F] shadow-md ring-2 ring-[#F6851F]/20'
                      : inq.status === 'new'
                      ? 'border-orange-200 bg-orange-50/20 hover:border-zinc-300'
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#081022]">{inq.customer_name}</span>
                        {inq.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-black uppercase">
                            NEW
                          </span>
                        )}
                        {inq.status === 'replied' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase">
                            Replied
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">{inq.email}</p>
                    </div>

                    <div className="text-right text-[11px] text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(inq.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-zinc-800 line-clamp-1 mb-1">
                    {inq.subject || 'Surgical Quote Request'}
                  </p>
                  <p className="text-xs text-zinc-500 line-clamp-2">{inq.message}</p>

                  {inq.company_name && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                      <Building className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{inq.company_name}</span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Right: Selected Detail Drawer */}
        <div className="lg:col-span-5">
          {selectedInquiry ? (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 sticky top-24 space-y-6 shadow-sm">
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-zinc-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6851F]">
                    Inquiry Detail
                  </span>
                  <h3 className="text-lg font-black text-[#081022] mt-0.5">
                    {selectedInquiry.customer_name}
                  </h3>
                  <p className="text-xs text-zinc-500">{selectedInquiry.email}</p>
                </div>

                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-zinc-200 transition cursor-pointer"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Contact Meta */}
              <div className="grid grid-cols-2 gap-3 bg-zinc-50 p-4 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">
                    Phone / WhatsApp
                  </span>
                  <span className="font-bold text-zinc-700">{selectedInquiry.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">
                    Company / Clinic
                  </span>
                  <span className="font-bold text-zinc-700">
                    {selectedInquiry.company_name || 'Individual Inquiry'}
                  </span>
                </div>
                <div className="col-span-2 pt-2 border-t border-zinc-200/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-0.5">
                    Submission Timestamp
                  </span>
                  <span className="font-semibold text-zinc-600">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items if Cart RFQ */}
              {selectedInquiry.items && selectedInquiry.items.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-700 block">
                    Requested Instruments ({selectedInquiry.items.length})
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {selectedInquiry.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs"
                      >
                        <div>
                          <span className="font-bold text-zinc-800">{item.title}</span>
                          <span className="text-[10px] text-zinc-400 block font-mono">
                            SKU: {item.sku}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-[#FFF4EB] text-[#F6851F] font-bold rounded">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <span className="text-xs font-bold text-zinc-700 block mb-2">Message Body</span>
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs leading-relaxed text-zinc-700 whitespace-pre-wrap">
                  {selectedInquiry.message || 'No additional message text provided.'}
                </div>
              </div>

              {/* Quick Status Changers */}
              <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-zinc-500">Update Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'read')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedInquiry.status === 'read'
                        ? 'bg-blue-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Mark Read
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedInquiry.id, 'replied')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedInquiry.status === 'replied'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                  >
                    Mark Replied
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center text-zinc-400">
              <Mail className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
              <p className="font-semibold text-zinc-600 text-xs">Select an inquiry to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
