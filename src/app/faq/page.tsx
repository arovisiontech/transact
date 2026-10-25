'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { Plus, Minus, Search, Mail, MessageCircle, HelpCircle } from 'lucide-react'
import { FaqItem } from '@/src/types'

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([])
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2'])
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faqs', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0) {
            setFaqs(data.filter((f: FaqItem) => f.is_published !== false))
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch FAQs:', err)
      }

      import('@/src/data/faqs.json').then((mod) => {
        setFaqs(mod.default as unknown as FaqItem[])
      })
    }

    loadFaqs()
  }, [])

  const toggleFaq = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const filtered = faqs.filter(
    (f) =>
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase())
  )

  // Split into 2 balanced columns matching Transact F.A.Q.svg
  const midIndex = Math.ceil(filtered.length / 2)
  const leftColumnFaqs = filtered.slice(0, midIndex)
  const rightColumnFaqs = filtered.slice(midIndex)

  return (
    <PublicShell>
      {/* Hero Section with image 333.svg */}
      <section className="relative bg-[#081022] text-white overflow-hidden py-24 sm:py-32 border-b border-zinc-800">
        {/* Background Image: image 333.svg */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/image 333.svg"
            alt="Hero Banner"
            fill
            unoptimized
            className="object-cover object-right opacity-45 pointer-events-none"
            priority
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#081022] via-[#081022]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#081022] via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 text-center sm:text-left">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold mb-4">
            <Link href="/" className="text-zinc-400 hover:text-white transition">
              Home
            </Link>
            <span className="text-zinc-500">/</span>
            <span className="text-[#F6851F]">FAQ&apos;s</span>
          </nav>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase">
            Frequently Asked Questions
          </h1>
          <p className="text-zinc-300 text-xs sm:text-sm max-w-xl mt-3 leading-relaxed">
            Everything you need to know about our instrument manufacturing, clinical standards, private label options, and global freight.
          </p>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading matching SVG */}
          <div className="space-y-4">
            {/* Tag with horizontal line */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#081022]">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <div className="w-12 h-[2px] bg-[#F6851F]" />
            </div>

            {/* Big Heading */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#081022] tracking-tight leading-tight max-w-4xl">
              Helpful Answers About Our Production And Delivery.
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#4B5D71] max-w-2xl leading-relaxed">
              Can&apos;t Find The Answer You Need? Email info@transactintl.com And Our Team Will Be Happy To Help.
            </p>
          </div>

          {/* Optional Search */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by keyword..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-[#FAFAFC] border border-zinc-200 focus:outline-none focus:border-[#F6851F]"
            />
          </div>

          {/* 2-Column Accordion Layout matching Transact F.A.Q.svg */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAFC] rounded-3xl border border-zinc-200">
              <HelpCircle className="w-10 h-10 text-zinc-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#081022]">No questions match your query.</p>
              <button
                onClick={() => setSearch('')}
                className="mt-3 px-4 py-1.5 bg-[#F6851F] text-white rounded-xl text-xs font-bold"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
              {/* Left Column */}
              <div className="space-y-4">
                {leftColumnFaqs.map((faq) => {
                  const isOpen = openIds.includes(faq.id)
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl sm:rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-2xs overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 transition"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[#081022] leading-snug">
                          {faq.question}
                        </span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[#F6851F]">
                          {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-[#4B5D71] leading-relaxed border-t border-zinc-100 animate-in fade-in duration-150">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {rightColumnFaqs.map((faq) => {
                  const isOpen = openIds.includes(faq.id)
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl sm:rounded-2xl border border-zinc-200 hover:border-zinc-300 transition-all duration-200 shadow-2xs overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-5 py-4 sm:py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-zinc-50/50 transition"
                      >
                        <span className="text-xs sm:text-sm font-bold text-[#081022] leading-snug">
                          {faq.question}
                        </span>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[#F6851F]">
                          {isOpen ? <Minus className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-[#4B5D71] leading-relaxed border-t border-zinc-100 animate-in fade-in duration-150">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Bottom CTA Banner matching Transact F.A.Q.svg */}
          <div className="rounded-3xl bg-[#F8FAFC] border border-zinc-200/80 p-8 sm:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Orange vertical accent bar on left */}
            <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#F6851F]" />

            <div className="space-y-3 max-w-2xl pl-2 sm:pl-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#081022] block">
                LET&apos;S START A CONVERSATION
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-[#081022] tracking-tight leading-tight">
                Need Help Finding The{' '}
                <span className="text-[#F6851F]">Right Instruments?</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
                Tell Us Your Product Requirements, Quantity And Destination. Our Team Will Guide You To The Right Next Step.
              </p>
            </div>

            {/* Buttons on Right matching SVG */}
            <div className="flex flex-wrap items-center gap-4 shrink-0">
              <a
                href="mailto:info@transactintl.com"
                className="px-6 py-3 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white font-bold text-xs sm:text-sm transition shadow-md shadow-[#F6851F]/20 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email Sale</span>
              </a>

              <a
                href="https://wa.me/923452626832"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-[#F6851F] border border-[#F6851F] font-bold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
