'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import PublicShell from '@/src/components/public/PublicShell'
import { MapPin, Globe, Phone, Mail, Search, ArrowRight, ShieldCheck } from 'lucide-react'

export default function DealerLocatorPage() {
  const [regionFilter, setRegionFilter] = useState('all')

  const dealers = [
    {
      name: 'North American Medical Logistics LLC',
      region: 'North America',
      country: 'United States',
      city: 'Chicago, IL',
      phone: '+1 (800) 450-8912',
      email: 'namerica@transactintl.com',
      coverage: 'USA, Canada & Mexico Direct Distribution',
    },
    {
      name: 'EuroSurg GmbH & Co. KG',
      region: 'Europe',
      country: 'Germany',
      city: 'Tuttlingen / Frankfurt',
      phone: '+49 69 9821 00',
      email: 'europe@transactintl.com',
      coverage: 'Germany, Austria, Switzerland, Benelux',
    },
    {
      name: 'Middle East Healthcare Partners FZ-LLC',
      region: 'Middle East',
      country: 'United Arab Emirates',
      city: 'Dubai Healthcare City',
      phone: '+971 4 382 9100',
      email: 'meast@transactintl.com',
      coverage: 'UAE, Saudi Arabia, Qatar, Kuwait, Oman',
    },
    {
      name: 'Asia-Pacific Surgical Instruments Pty Ltd',
      region: 'Asia Pacific',
      country: 'Australia',
      city: 'Sydney, NSW',
      phone: '+61 2 9182 3400',
      email: 'apac@transactintl.com',
      coverage: 'Australia, New Zealand & Southeast Asia',
    },
    {
      name: 'Transact Latin America S.A.',
      region: 'Latin America',
      country: 'Brazil',
      city: 'São Paulo',
      phone: '+55 11 3920 1800',
      email: 'latam@transactintl.com',
      coverage: 'Brazil, Argentina, Chile, Colombia',
    },
    {
      name: 'Southern African Medical Consortium',
      region: 'Africa',
      country: 'South Africa',
      city: 'Johannesburg',
      phone: '+27 11 829 3000',
      email: 'africa@transactintl.com',
      coverage: 'South Africa, Kenya, Nigeria, Ghana',
    },
  ]

  const regions = ['all', 'North America', 'Europe', 'Middle East', 'Asia Pacific', 'Latin America', 'Africa']

  const filtered = regionFilter === 'all'
    ? dealers
    : dealers.filter((d) => d.region === regionFilter)

  return (
    <PublicShell>
      <div className="bg-[#081022] text-white py-16 px-4 sm:px-8 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F6851F] bg-[#FFF4EB]/10 px-3 py-1 rounded-full border border-[#F6851F]/30">
            Authorized Global Network
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Transact International Authorized Distributors
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Locate authorized surgical instrument distributors, local bonded inventory depots, and regional support representatives in your territory.
          </p>
        </div>
      </div>

      <section className="py-16 px-4 sm:px-8 bg-[#FAFAFC]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegionFilter(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                  regionFilter === r
                    ? 'bg-[#081022] text-white shadow-md'
                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                }`}
              >
                {r === 'all' ? 'All Global Territories' : r}
              </button>
            ))}
          </div>

          {/* Distributors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white border border-zinc-200 shadow-sm transact-card space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FFF4EB] text-[#F6851F]">
                    {d.region}
                  </span>
                  <span className="text-xs font-bold text-[#081022]">{d.country}</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#081022]">{d.name}</h3>
                  <p className="text-xs text-[#F6851F] font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {d.city}
                  </p>
                </div>

                <p className="text-xs text-[#4B5D71] leading-relaxed">
                  {d.coverage}
                </p>

                <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs">
                  <p className="font-mono text-zinc-600">{d.phone}</p>
                  <p className="text-[#081022] font-semibold">{d.email}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Become a Distributor CTA */}
          <div className="mt-12 p-8 sm:p-12 rounded-3xl bg-[#081022] text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl text-center sm:text-left">
              <h3 className="text-2xl font-bold">Interested in Becoming an Authorized Distributor?</h3>
              <p className="text-xs sm:text-sm text-zinc-300">
                We offer exclusive territorial distribution rights, localized marketing collateral, and volume factory discount tiers.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-6 py-3 bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold rounded-xl transition shadow shrink-0"
            >
              Apply for Dealership
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  )
}
