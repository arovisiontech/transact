'use client'

import React, { useState, useEffect } from 'react'
import {
  Settings,
  Save,
  Building,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Globe,
  Share2,
  ShieldAlert,
  Lock,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { StoreSettings } from '@/src/types'
import { getStoreSettings, saveStoreSettings } from '@/src/lib/dataStore'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: 'Transact International',
    tagline: 'Precision Surgical & Medical Instruments Manufacturing',
    contact_email: 'info@transactintl.com',
    support_email: 'sales@transactintl.com',
    sales_phone: '+92 300 1234567',
    whatsapp_number: '+92 300 1234567',
    factory_address: 'Transact Industrial Facility, Small Industries Estate',
    city_country: 'Sialkot 51310, Punjab, Pakistan',
    working_hours: 'Mon - Sat: 8:00 AM - 6:00 PM (GMT+5)',
    facebook_url: 'https://facebook.com/transactintl',
    linkedin_url: 'https://linkedin.com/company/transactintl',
    instagram_url: 'https://instagram.com/transactintl',
    twitter_url: 'https://twitter.com/transactintl',
    youtube_url: 'https://youtube.com',
    iso_certified: true,
    ce_certified: true,
    fda_registered: true,
    block_pakistan: true,
    blocked_countries: ['PK'],
    geo_bypass_key: 'transact',
  })

  useEffect(() => {
    const loaded = getStoreSettings()
    if (loaded) {
      setSettings(loaded)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    saveStoreSettings(settings)

    if (typeof window !== 'undefined') {
      const isBlocked = settings.block_pakistan !== false
      localStorage.setItem('transact_block_pk', String(isBlocked))
      document.cookie = `transact_block_pk=${isBlocked}; path=/; max-age=2592000`
    }

    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
    } catch (err) {
      console.warn('Settings API sync error:', err)
    }

    toast.success('Site settings saved and applied to storefront!')
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <Settings className="w-4 h-4" />
            <span>Store Configuration</span>
          </div>
          <h1 className="text-2xl font-black text-[#081022] mt-1">Company & Global Settings</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Configure contact coordinates, facility address, working hours, and certification compliance badges.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-bold transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Brand Details */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Building className="w-4 h-4 text-[#F6851F]" />
            <h2 className="text-sm font-bold text-[#081022] uppercase tracking-wide">
              Company Identity
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Company / Store Name</label>
              <input
                type="text"
                required
                value={settings.store_name}
                onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs font-bold focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Coordinates */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Phone className="w-4 h-4 text-[#F6851F]" />
            <h2 className="text-sm font-bold text-[#081022] uppercase tracking-wide">
              Communication & Support
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                required
                value={settings.contact_email}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Sales & RFQ Email</label>
              <input
                type="email"
                required
                value={settings.support_email}
                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Sales Phone / Direct Line</label>
              <input
                type="text"
                value={settings.sales_phone}
                onChange={(e) => setSettings({ ...settings, sales_phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">WhatsApp Business Number</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+923001234567"
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Manufacturing Facility & Location */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Globe className="w-4 h-4 text-[#F6851F]" />
            <h2 className="text-sm font-bold text-[#081022] uppercase tracking-wide">
              Facility Address & Operation Hours
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-zinc-700 mb-1">Factory / Street Address</label>
              <input
                type="text"
                value={settings.factory_address}
                onChange={(e) => setSettings({ ...settings, factory_address: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">City, Postal Code, Country</label>
              <input
                type="text"
                value={settings.city_country}
                onChange={(e) => setSettings({ ...settings, city_country: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Working Hours</label>
              <input
                type="text"
                value={settings.working_hours}
                onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Quality Certifications */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <ShieldCheck className="w-4 h-4 text-[#F6851F]" />
            <h2 className="text-sm font-bold text-[#081022] uppercase tracking-wide">
              Medical Device Compliance Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.iso_certified}
                onChange={(e) => setSettings({ ...settings, iso_certified: e.target.checked })}
                className="rounded text-[#F6851F] focus:ring-[#F6851F] w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-[#081022] block">ISO 13485:2016</span>
                <span className="text-[10px] text-zinc-500">Medical Devices QMS</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ce_certified}
                onChange={(e) => setSettings({ ...settings, ce_certified: e.target.checked })}
                className="rounded text-[#F6851F] focus:ring-[#F6851F] w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-[#081022] block">CE Mark Conformity</span>
                <span className="text-[10px] text-zinc-500">MDR 2017/745 Class I & IIa</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 bg-zinc-50 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.fda_registered}
                onChange={(e) => setSettings({ ...settings, fda_registered: e.target.checked })}
                className="rounded text-[#F6851F] focus:ring-[#F6851F] w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-[#081022] block">FDA Registered</span>
                <span className="text-[10px] text-zinc-500">USA Import Compliant</span>
              </div>
            </label>
          </div>
        </div>

        {/* ── Geo-Fencing & Country Access Restriction (Pakistan Block) ── */}
        <div className="bg-white p-6 rounded-2xl border-2 border-red-100 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="text-sm font-black text-[#081022] uppercase tracking-wide">
                  Geo-Fencing &amp; Region Blocking
                </h2>
                <p className="text-xs text-zinc-500">
                  Control website access by country. Restricts public visitor traffic while keeping Admin Panel accessible.
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black self-start sm:self-auto ${
                settings.block_pakistan !== false
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.block_pakistan !== false ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                }`}
              />
              {settings.block_pakistan !== false
                ? 'Pakistan Traffic: BLOCKED'
                : 'Pakistan Traffic: ALLOWED'}
            </span>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-3.5 p-4 rounded-xl border border-red-200 bg-red-50/40 cursor-pointer hover:bg-red-50/70 transition">
              <input
                type="checkbox"
                checked={settings.block_pakistan !== false}
                onChange={(e) => setSettings({ ...settings, block_pakistan: e.target.checked })}
                className="rounded text-red-600 focus:ring-red-500 w-5 h-5 mt-0.5 cursor-pointer"
              />
              <div className="space-y-1">
                <span className="text-xs font-black text-red-900 block">
                  Block Website in Pakistan (Country Code: PK)
                </span>
                <p className="text-[11px] text-zinc-600 leading-relaxed">
                  When enabled, visitors from Pakistan will see a professional &quot;Website Under Construction &amp; System Upgrade in Progress&quot; platform notice.
                  Visitors from all other countries worldwide (USA, UK, Europe, Middle East, etc.) will have full, normal access.
                </p>
              </div>
            </label>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#081022]">
                <Lock className="w-4 h-4 text-[#F6851F]" />
                <span>Admin &amp; Client Access from Pakistan</span>
              </div>
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                • <strong>Admin Panel (<code className="text-[#F6851F] font-mono">/admin</code>):</strong> Always 100% accessible from Pakistan so you can manage products, categories, and settings anytime without being locked out.
              </p>
              <div className="space-y-1.5 pt-1">
                <p className="text-[11px] text-zinc-700 font-bold">
                  • Secret Client Preview Link (Send this to yourself or your client):
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-white border border-zinc-300 rounded-lg text-xs font-mono font-bold text-[#F6851F] select-all">
                    /preview
                  </code>
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        const url = `${window.location.origin}/preview`
                        navigator.clipboard.writeText(url)
                        toast.success('Secret Client Preview Link copied to clipboard!')
                      }
                    }}
                    className="px-3 py-2 bg-[#F6851F] hover:bg-[#e07314] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    Copy Full Link
                  </button>
                </div>
                <p className="text-[10px] text-zinc-500">
                  Anyone who clicks this link will have full access unlocked on their phone or computer, while all other Pakistan visitors see an empty 404 page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Share2 className="w-4 h-4 text-[#F6851F]" />
            <h2 className="text-sm font-bold text-[#081022] uppercase tracking-wide">
              Social Links
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={settings.linkedin_url || ''}
                onChange={(e) => setSettings({ ...settings, linkedin_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Facebook Page</label>
              <input
                type="text"
                value={settings.facebook_url || ''}
                onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#F6851F]/20 cursor-pointer"
          >
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  )
}
