'use client'

import React from 'react'
import PublicShell from '@/src/components/public/PublicShell'

export default function ReturnsRefundsPage() {
  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">Warranty & Service</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Returns & Replacement Policy</h1>
          <p className="text-zinc-400 text-xs">Quality assurance guarantees and claim handling</p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-6 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          <div>
            <h2 className="text-lg font-bold text-[#081022]">Lifetime Guarantee on Material Flaws</h2>
            <p className="mt-1">
              Transact International instruments are guaranteed against breakage, pitting, and hinge loosening resulting from manufacturing defect or raw material impurity. Defective items will be replaced free of charge or credited toward your next procurement order.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#081022]">Return Procedures</h2>
            <p className="mt-1">
              Notify our QA department within 30 days of shipment arrival with batch number and photographic documentation of any observed discrepancy. Our technical inspection team will issue a Return Material Authorization (RMA) within 48 hours.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
