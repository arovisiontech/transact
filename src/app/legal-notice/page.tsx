'use client'

import React from 'react'
import PublicShell from '@/src/components/public/PublicShell'

export default function LegalNoticePage() {
  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">Statutory Information</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Legal Notice & Corporate Registry</h1>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-6 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-[#081022]">Company Information</h2>
            <p className="mt-1">
              Transact International (Pvt) Ltd.<br />
              Small Industrial Estate, Sambrial Road, Sialkot 51310, Pakistan.<br />
              Member: Sialkot Chamber of Commerce & Industry (SCCI)<br />
              Member: Surgical Instruments Manufacturers Association of Pakistan (SIMAP)<br />
              Federal Board of Revenue NTN / STRN Registered
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#081022]">Regulatory Conformity</h2>
            <p className="mt-1">
              Medical Device Directive 93/42/EEC & Medical Device Regulation (EU) 2017/745 (MDR).<br />
              EN ISO 13485:2016 Medical Devices Quality Management System.<br />
              US FDA Registered Establishment for Class I and Class II Surgical Devices.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
