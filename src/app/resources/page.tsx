'use client'

import React from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { BookOpen, Download, FileText, ArrowRight, ShieldCheck } from 'lucide-react'

export default function ResourcesPage() {
  const docs = [
    { title: 'Standard Passivation & Autoclave Protocol (PDF)', desc: 'Best practices for steam autoclaving at 134°C without staining.', url: '/catalogues/Artery-Forceps-Section4.pdf' },
    { title: 'ISO 13485:2016 Certificate of Registration', desc: 'Official auditor certification of quality management compliance.', url: '/catalogues/Artery-Forceps-Section4.pdf' },
    { title: 'Medical Device CE Declaration of Conformity', desc: 'Directives covering general and specialized surgical devices.', url: '/catalogues/Artery-Forceps-Section4.pdf' },
    { title: 'Stainless Steel Chemical Composition Guide (ASTM F899)', desc: 'Metallurgical breakdown of AISI 410, 420A/B, and 316L medical grades.', url: '/catalogues/Artery-Forceps-Section4.pdf' },
  ]

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">Knowledge Center</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Quality & Technical Resources</h1>
          <p className="text-zinc-400 text-xs">Official documentation, certificates, and compliance manuals</p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-4xl mx-auto space-y-4">
          {docs.map((doc, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#081022]">{doc.title}</h3>
                <p className="text-xs text-[#4B5D71]">{doc.desc}</p>
              </div>
              <a
                href={doc.url}
                download
                className="px-4 py-2 bg-[#FFF4EB] hover:bg-[#F6851F] text-[#F6851F] hover:text-white rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </a>
            </div>
          ))}
        </div>
      </section>
    </PublicShell>
  )
}
