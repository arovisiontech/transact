'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  Image as ImageIcon,
  Copy,
  Check,
  Search,
  ExternalLink,
  Eye,
  X,
  FileImage,
} from 'lucide-react'
import { toast } from 'sonner'

interface MediaAsset {
  id: string
  name: string
  path: string
  type: 'Hero' | 'Facility' | 'Product' | 'Logo' | 'Feature'
  dimensions?: string
}

const mediaLibrary: MediaAsset[] = [
  {
    id: 'asset-logo',
    name: 'Transact Official Brand Logo',
    path: '/Asset 27 1.svg',
    type: 'Logo',
  },
  {
    id: 'asset-building',
    name: 'Transact Modern Manufacturing Facility',
    path: '/building-jpg 1.svg',
    type: 'Facility',
  },
  {
    id: 'asset-hero-svg',
    name: 'Transact Hero Instrument Graphic (SVG)',
    path: '/image 333.svg',
    type: 'Hero',
  },
  {
    id: 'asset-hero-clean',
    name: 'Hero Precision Medical Instrument Array',
    path: '/images/transact/image0_3812_2.png',
    type: 'Hero',
  },
  {
    id: 'asset-building-png',
    name: 'HQ Industrial Plant Exterior',
    path: '/images/transact/image2_3812_2.png',
    type: 'Facility',
  },
  {
    id: 'asset-forceps-1',
    name: 'Transact Precision Surgical Scissors',
    path: '/images/transact/image5_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-needle-holder',
    name: 'Tungsten Carbide Needle Holder Series',
    path: '/images/transact/image6_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-artery-forceps',
    name: 'Hemostatic Kelly / Crile Artery Forceps',
    path: '/images/transact/image7_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-retractor',
    name: 'Self-Retaining Weitlaner Retractor',
    path: '/images/transact/image8_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-bipolar-forceps',
    name: 'Electrosurgical Bipolar Coagulation Forceps',
    path: '/images/transact/image9_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-scalpel-handles',
    name: 'Graduated Ergonomic Scalpel Handles #3 / #4',
    path: '/images/transact/image10_3812_2.jpg',
    type: 'Product',
  },
  {
    id: 'asset-feature-1',
    name: 'German Grade Stainless Steel AISI 420 Specimen',
    path: '/images/transact/image3_3812_2.png',
    type: 'Feature',
  },
  {
    id: 'asset-feature-2',
    name: 'Micro-Surgical Inspection Microscope Station',
    path: '/images/transact/image4_3812_2.png',
    type: 'Feature',
  },
  {
    id: 'asset-production-1',
    name: 'Cleanroom Ultrasonic Wash & Passivation Station',
    path: '/images/transact/image11_3812_2.png',
    type: 'Facility',
  },
  {
    id: 'asset-production-2',
    name: 'Vacuum Heat Treatment & Hardness Testing',
    path: '/images/transact/image12_3812_2.png',
    type: 'Facility',
  },
  {
    id: 'asset-production-3',
    name: '5-Axis CNC Precision Forging & Milling',
    path: '/images/transact/image13_3812_2.png',
    type: 'Facility',
  },
  {
    id: 'asset-packaging',
    name: 'Individual Barcode & Medical Blister Pack Line',
    path: '/images/transact/image14_3812_2.png',
    type: 'Facility',
  },
  {
    id: 'asset-facility-view',
    name: 'Transact Corporate Campus Panoramic View',
    path: '/images/transact/image20_3812_2.jpg',
    type: 'Facility',
  },
]

export default function AdminMediaPage() {
  const [filterType, setFilterType] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null)

  const filteredAssets = mediaLibrary.filter((asset) => {
    const matchesType = filterType === 'All' || asset.type === filterType
    const matchesSearch =
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.path.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesSearch
  })

  const handleCopyPath = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.path)
    setCopiedId(asset.id)
    toast.success(`Copied path: ${asset.path}`)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F6851F]">
            <ImageIcon className="w-4 h-4" />
            <span>Digital Asset Management</span>
          </div>
          <h1 className="text-2xl font-black text-[#081022] mt-1">Transact Media Library</h1>
          <p className="text-xs text-zinc-500 mt-1">
            Browse and copy paths for all high-resolution brand visuals, SVGs, and surgical instruments.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-zinc-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by filename or keyword..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-zinc-200 text-xs focus:ring-2 focus:ring-[#F6851F] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Product', 'Hero', 'Facility', 'Logo', 'Feature'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                filterType === type
                  ? 'bg-[#081022] text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Assets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredAssets.map((asset) => {
          const isCopied = copiedId === asset.id
          return (
            <div
              key={asset.id}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-[#F6851F]/40 hover:shadow-md transition group flex flex-col justify-between"
            >
              <div
                onClick={() => setPreviewAsset(asset)}
                className="relative aspect-square bg-zinc-50 cursor-pointer overflow-hidden p-2 flex items-center justify-center border-b border-zinc-100"
              >
                <Image
                  src={asset.path}
                  alt={asset.name}
                  fill
                  unoptimized
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-black/60 text-white px-1.5 py-0.5 rounded">
                  {asset.type}
                </span>

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 bg-white rounded-xl text-zinc-800 shadow">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div className="p-3 space-y-2">
                <h4 className="text-xs font-bold text-[#081022] line-clamp-1">{asset.name}</h4>
                <p className="text-[10px] text-zinc-400 font-mono line-clamp-1">{asset.path}</p>

                <button
                  onClick={() => handleCopyPath(asset)}
                  className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    isCopied
                      ? 'bg-emerald-500 text-white'
                      : 'bg-zinc-100 hover:bg-[#FFF4EB] text-zinc-700 hover:text-[#F6851F]'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Path'}</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Asset Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-zinc-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F6851F]">
                  Asset Inspection
                </span>
                <h3 className="text-base font-black text-[#081022]">{previewAsset.name}</h3>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-2 rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center">
              <Image
                src={previewAsset.path}
                alt={previewAsset.name}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <span className="text-xs font-mono text-zinc-500">{previewAsset.path}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(previewAsset.path)
                  toast.success('Path copied!')
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F6851F] text-white text-xs font-bold hover:bg-[#E07314] transition shadow-md shadow-[#F6851F]/20 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Path</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
