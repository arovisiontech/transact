'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderOpen,
  Package,
  BookOpen,
  Mail,
  Image as ImageIcon,
  Settings,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  Info,
  Factory,
  HelpCircle,
} from 'lucide-react'
import TransactLogo from '@/src/components/public/TransactLogo'

const sidebarSections = [
  {
    title: 'GENERAL',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'CATALOG',
    items: [
      { label: 'Products', href: '/admin/products', icon: Package },
      { label: 'Categories', href: '/admin/categories', icon: FolderOpen },
      { label: 'Subcategories', href: '/admin/subcategories', icon: Layers },
      { label: 'Catalogue PDFs', href: '/admin/catalogues', icon: BookOpen },
    ],
  },
  {
    title: 'CONTENT & HOME',
    items: [
      { label: 'Hero Slides', href: '/admin/home/hero-slides', icon: Sliders },
      { label: 'Product Line & Dev', href: '/admin/home/product-line', icon: Layers },
      { label: 'Promotional Banners', href: '/admin/home/banners', icon: Sparkles },
      { label: 'About Us Page', href: '/admin/about', icon: Info },
      { label: 'Manufacturing Process', href: '/admin/manufacturing', icon: Factory },
      { label: 'FAQ Management', href: '/admin/faqs', icon: HelpCircle },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'RFQ & Inquiries', href: '/admin/inquiries', icon: Mail },
    ],
  },
  {
    title: 'MEDIA & SETTINGS',
    items: [
      { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { label: 'Site Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ isOpen = true }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'GENERAL',
    'CATALOG',
    'CONTENT & HOME',
    'COMMUNICATION',
    'MEDIA & SETTINGS',
  ])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside
      aria-label="Admin Navigation Sidebar"
      className={`flex h-full flex-col bg-[#081022] border-r border-zinc-800 ${
        isOpen ? 'w-64' : 'w-0 overflow-hidden'
      } transition-all duration-300 text-white`}
    >
      {/* Brand Header */}
      <div className="border-b border-zinc-800 p-5 flex items-center justify-between">
        <TransactLogo variant="light" width={160} />
      </div>

      {/* Nav List */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-4">
        {sidebarSections.map((section) => {
          const isExpanded = expandedSections.includes(section.title)
          return (
            <div key={section.title} className="space-y-1">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-3 py-1.5 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition flex items-center justify-between"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {isExpanded && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href)
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                          active
                            ? 'bg-[#F6851F] text-white shadow-md shadow-[#F6851F]/20'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Store Quick Link */}
      <div className="p-4 border-t border-zinc-800 bg-[#05163F]/50">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition"
        >
          <span>Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#F6851F]" />
        </Link>
      </div>
    </aside>
  )
}
