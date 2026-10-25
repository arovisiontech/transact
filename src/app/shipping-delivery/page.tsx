'use client'

import React from 'react'
import PublicShell from '@/src/components/public/PublicShell'
import { Plane, Ship, Package, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function ShippingDeliveryPage() {
  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-14 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F]">Global Logistics</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Shipping & Delivery Information</h1>
          <p className="text-zinc-400 text-xs">International export guidelines and transit schedules</p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-4xl mx-auto space-y-8 text-xs sm:text-sm text-[#4B5D71] leading-relaxed">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-2">
              <Plane className="w-8 h-8 text-[#F6851F]" />
              <h3 className="text-base font-bold text-[#081022]">Express Air Cargo (3 - 5 Days)</h3>
              <p>For urgent clinical replenishment and surgical sets. Partnered with DHL Aviation, FedEx Express, and Emirates SkyCargo.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAFAFC] border border-zinc-200 space-y-2">
              <Ship className="w-8 h-8 text-[#F6851F]" />
              <h3 className="text-base font-bold text-[#081022]">Ocean Freight (FCL / LCL)</h3>
              <p>Cost-effective sea container shipping for bulk wholesale distribution. Departs weekly from Port of Karachi to European and North American ports.</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-100">
            <h3 className="text-lg font-bold text-[#081022]">Customs Documentation Included</h3>
            <p>Every international consignment is accompanied by:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Commercial Invoice with HS Codes (Harmonized System 9018.90)</li>
              <li>Detailed Packing List with net/gross weights and cubic meter dimensions</li>
              <li>Certificate of Origin verified by Chamber of Commerce</li>
              <li>Certificate of Free Sale & ISO 13485 Compliance Declaration</li>
              <li>Material Metallurgical Test Reports (Mill Test Certificates)</li>
            </ul>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
