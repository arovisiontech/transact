'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react'
import Image from 'next/image'
import { getQuoteCart, getStoredCategories } from '@/src/lib/dataStore'
import { CategoryItem } from '@/src/types'

interface PublicHeaderProps {
  onOpenSearch?: () => void
  onOpenQuote?: () => void
}

interface NavLinkItem {
  name: string
  href: string
  hasDropdown?: boolean
  items?: { name: string; href: string }[]
}

export default function PublicHeader({ onOpenSearch, onOpenQuote }: PublicHeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpandedDropdown, setMobileExpandedDropdown] = useState<string | null>(null)
  const [quoteCount, setQuoteCount] = useState(0)
  const [isOverProductLine, setIsOverProductLine] = useState(false)
  const [categories, setCategories] = useState<CategoryItem[]>([])

  useEffect(() => {
    const updateCategories = () => {
      const all = getStoredCategories() || []
      const active = all.filter((c) => c && c.is_published !== false)
      setCategories(active)
    }
    updateCategories()

    window.addEventListener('transact_data_updated', updateCategories)
    return () => window.removeEventListener('transact_data_updated', updateCategories)
  }, [])

  useEffect(() => {
    const updateQuote = () => {
      const cart = getQuoteCart() || []
      const total = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item?.quantity || 1), 0) : 0
      setQuoteCount(total)
    }
    updateQuote()

    window.addEventListener('transact_data_updated', updateQuote)
    return () => window.removeEventListener('transact_data_updated', updateQuote)
  }, [])

  // Detect when navbar is scrolling over "Our Complete Product Line" section
  useEffect(() => {
    const checkScroll = () => {
      const el1 = document.getElementById('complete-product-line-showcase')
      const el2 = document.getElementById('product-line-section')

      const isOver = (el: HTMLElement | null) => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top <= 72 && rect.bottom >= 72
      }

      setIsOverProductLine(isOver(el1) || isOver(el2))
    }

    window.addEventListener('scroll', checkScroll, { passive: true })
    checkScroll()
    return () => window.removeEventListener('scroll', checkScroll)
  }, [])

  // Navigation Links:
  // Home | About Us | Products | Service v | Quality v | Contact
  const navLinks: NavLinkItem[] = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    {
      name: 'Products',
      href: '/products',
      hasDropdown: true,
      items: [
        { name: 'All Instruments Catalog', href: '/products' },
        ...(categories.length > 0
          ? categories.map((c) => ({
              name: c.name,
              href: `/products?category=${encodeURIComponent(c.slug || c.id)}`,
            }))
          : [
              { name: 'Reusable Laryngoscopes', href: '/products?category=reusable-laryngoscopes' },
              { name: 'Single Use Laryngoscopes', href: '/products?category=single-use-laryngoscopes' },
              { name: 'Diagnostic & Otoscopy Sets', href: '/products?category=diagnostics' },
              { name: 'Pocket Otoscopes', href: '/products?category=pocket-otoscopes' },
            ]),
      ],
    },
    {
      name: 'Service',
      href: '/production',
      hasDropdown: true,
      items: [
        { name: 'Manufacturing Process', href: '/production' },
        { name: 'Product Catalogues', href: '/catalogues' },
        { name: 'Frequently Asked Questions (FAQ)', href: '/faq' },
      ],
    },
    {
      name: 'Quality',
      href: '/about#quality',
      hasDropdown: true,
      items: [
        { name: 'Manufacturing Process', href: '/production' },
        { name: 'ISO 13485:2016 Certified', href: '/about#quality' },
        { name: 'CE Mark & MDR 2017/745', href: '/about#quality' },
        { name: 'FDA QSR & cGMP Standards', href: '/about#quality' },
        { name: 'Metallurgical & Tensile Testing', href: '/about#quality' },
      ],
    },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={
        isOverProductLine
          ? {
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px 0 rgba(0, 0, 0, 0.05)',
              borderBottom: '1px solid rgba(8, 16, 34, 0.08)',
            }
          : {
              backgroundColor: 'rgba(8, 16, 34, 0.90)', // 10% transparent (90% opacity)
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 24px 0 rgba(0, 0, 0, 0.35)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }
      }
    >
      {/* ── Main Nav Container ── */}
      <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between h-[72px]">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Asset 27 1.svg"
            alt="Transact International"
            width={168}
            height={46}
            unoptimized
            priority
            className="object-contain transition-all duration-300"
            style={{
              filter: isOverProductLine
                ? 'brightness(0) saturate(100%) invert(8%) sepia(20%) saturate(2500%) hue-rotate(185deg)'
                : 'none',
            }}
          />
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 mx-auto">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))

            if (link.hasDropdown) {
              const isOpen = activeDropdown === link.name
              return (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-[15px] font-semibold transition-colors rounded-lg ${
                      isActive
                        ? 'text-[#F6851F]'
                        : isOverProductLine
                        ? 'text-[#081022] hover:text-[#F6851F]'
                        : 'text-white hover:text-[#F6851F]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isOverProductLine ? 'text-[#081022]' : 'text-[#F6851F]'
                      } ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </Link>

                  {/* Dropdown Menu with Hover Bridge */}
                  {isOpen && link.items && (
                    <div className="absolute top-full left-0 pt-2 z-50 w-72 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="bg-[#0A1328] rounded-2xl shadow-2xl border border-white/10 py-2 text-white max-h-[460px] overflow-y-auto">
                        {link.items.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            onClick={() => setActiveDropdown(null)}
                            className="flex items-center justify-between px-4 py-2.5 text-xs font-medium text-slate-200 hover:text-[#F6851F] hover:bg-white/5 transition"
                          >
                            <span>{sub.name}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-[#F6851F]" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3.5 py-2 text-[15px] font-semibold transition-colors rounded-lg ${
                  isActive
                    ? 'text-[#F6851F]'
                    : isOverProductLine
                    ? 'text-[#081022] hover:text-[#F6851F]'
                    : 'text-white hover:text-[#F6851F]'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Right: Search Icon + Cart Icon + "Partner With Us ->" Pill Button */}
        <div className="flex items-center gap-4 sm:gap-5 shrink-0">
          {/* 1. Search Icon (search-icon 1.svg) */}
          <button
            onClick={onOpenSearch}
            aria-label="Search instruments"
            className="relative p-1 hover:opacity-85 transition transform hover:scale-105"
            style={{
              filter: isOverProductLine ? 'brightness(0)' : 'none',
            }}
          >
            <Image
              src="/search-icon 1.svg"
              alt="Search"
              width={34}
              height={34}
              unoptimized
              className="object-contain"
            />
          </button>

          {/* 2. Basket / Shopping Cart Icon (basket-icon 1.svg) */}
          <button
            onClick={onOpenQuote}
            aria-label="View quotation cart"
            className="relative p-1 hover:opacity-85 transition transform hover:scale-105"
            style={{
              filter: isOverProductLine ? 'brightness(0)' : 'none',
            }}
          >
            <Image
              src="/basket-icon 1.svg"
              alt="Basket"
              width={36}
              height={36}
              unoptimized
              className="object-contain"
            />
            {quoteCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#F6851F] text-white text-[10px] font-extrabold flex items-center justify-center shadow">
                {quoteCount}
              </span>
            )}
          </button>

          {/* 3. "Partner With Us ->" Orange Pill Button */}
          <Link
            href="/contact"
            className="hidden sm:inline-flex items-center gap-2 px-6 py-2.5 bg-[#F6851F] hover:bg-[#E07314] text-white text-sm font-bold rounded-full transition-all duration-200 shadow-md shadow-[#F6851F]/30 hover:shadow-lg hover:shadow-[#F6851F]/40 hover:-translate-y-0.5 whitespace-nowrap"
          >
            <span>Partner With Us</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation"
            className={`lg:hidden p-2 rounded-xl transition ${
              isOverProductLine
                ? 'bg-black/5 text-[#081022] hover:bg-black/10'
                : 'bg-white/5 text-white hover:bg-white/10'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#0A1328]/98 backdrop-blur-2xl border-t border-white/10 px-5 py-4 space-y-1 max-h-[calc(100vh-75px)] overflow-y-auto">
          {navLinks.map((link) => {
            const hasSub = Boolean(link.hasDropdown && link.items && link.items.length > 0)
            const isExpanded = mobileExpandedDropdown === link.name

            if (hasSub) {
              return (
                <div key={link.name} className="border-b border-white/5 py-1">
                  <button
                    type="button"
                    onClick={() => setMobileExpandedDropdown(isExpanded ? null : link.name)}
                    className="w-full flex items-center justify-between py-2.5 text-[15px] font-bold text-white hover:text-[#F6851F] transition text-left cursor-pointer"
                  >
                    <span>{link.name}</span>
                    <span className="p-1.5 rounded-lg bg-white/5 text-[#F6851F]">
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </span>
                  </button>

                  {/* Expandable Submenu Accordion */}
                  {isExpanded && (
                    <div className="pl-3 pr-1 py-2 my-1 space-y-1.5 bg-black/30 rounded-xl border border-white/5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <Link
                        href={link.href}
                        onClick={() => {
                          setIsMobileMenuOpen(false)
                          setMobileExpandedDropdown(null)
                        }}
                        className="flex items-center justify-between py-2 px-3 text-xs font-bold text-[#F6851F] hover:bg-white/5 rounded-lg transition"
                      >
                        <span>View All {link.name}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {link.items?.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            setMobileExpandedDropdown(null)
                          }}
                          className="flex items-center justify-between py-2 px-3 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                          <span>{sub.name}</span>
                          <ArrowRight className="w-3 h-3 text-[#F6851F] shrink-0" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-[15px] font-bold text-white hover:text-[#F6851F] border-b border-white/5 transition"
              >
                {link.name}
              </Link>
            )
          })}

          <div className="pt-4 pb-2">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#F6851F] hover:bg-[#E07314] text-white text-sm font-bold rounded-full shadow-lg shadow-orange-500/20 transition"
            >
              <span>Partner With Us</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
