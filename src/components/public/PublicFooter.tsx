'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function FacebookIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  )
}

// Custom Pinterest Icon
function PinterestIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  )
}

export default function PublicFooter() {
  return (
    <footer className="bg-[#0A1328] text-white overflow-hidden border-t border-[#1E293B]">
      {/* Main Footer Container */}
      <div className="max-w-[1600px] 3xl:max-w-[1800px] mx-auto px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14">
          {/* Column 1: Logo & Locations (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/Asset 27 1.svg"
                alt="Transact International"
                width={200}
                height={50}
                unoptimized
                className="object-contain"
              />
            </Link>

            <div className="space-y-3 pt-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-wider">
                OUR LOCATIONS
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Roras Road Muzaffar Pur,<br />
                Sialkot - 51310 Pakistan.
              </p>
              <div className="space-y-1 text-sm text-slate-300 pt-1">
                <p>Phone : (+92) 345-2626832</p>
                <p>Phone: (+92) 52-3251700 | (+92) 52-3258989</p>
              </div>
              <p className="text-sm text-slate-300 pt-1">
                Email: <a href="mailto:info@transactintl.com" className="text-slate-300 hover:text-[#F36C21] transition">info@transactintl.com</a>
              </p>
            </div>

            {/* Social Icons (Orange rounded squares matching design) */}
            <div className="flex items-center gap-2.5 pt-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F36C21] hover:bg-[#E05B13] flex items-center justify-center text-white transition shadow-sm"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F36C21] hover:bg-[#E05B13] flex items-center justify-center text-white transition shadow-sm"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F36C21] hover:bg-[#E05B13] flex items-center justify-center text-white transition shadow-sm"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F36C21] hover:bg-[#E05B13] flex items-center justify-center text-white transition shadow-sm"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-[#F36C21] hover:bg-[#E05B13] flex items-center justify-center text-white transition shadow-sm"
                aria-label="Pinterest"
              >
                <PinterestIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-base font-bold">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/about" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> About Us
                </Link>
              </li>
              <li>
                <Link href="/production" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Manufacturing Process
                </Link>
              </li>
              <li>
                <Link href="/about#history" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> History
                </Link>
              </li>
              <li>
                <Link href="/about#csr" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> CSR
                </Link>
              </li>
              <li>
                <Link href="/about#compliance" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Compliance
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> News
                </Link>
              </li>
              <li>
                <Link href="/catalogues" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Product Catalogues
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> FAQ&apos;s
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Quality
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Product Range (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-white text-base font-bold">
              Product Range
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/products" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Laryngoscopy
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Diagnostics
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Video Laryngoscopy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Data Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-white text-base font-bold">
              Data Policies
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <Link href="/privacy-policy" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-[#F36C21] transition flex items-center gap-1.5">
                  <span className="text-slate-400">•</span> Terms Of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Giant Hollow / Outline Typography */}
        <div className="w-full pt-8 pb-4 text-center select-none overflow-hidden border-t border-white/5">
          <p
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[106px] 2xl:text-[124px] 3xl:text-[144px] font-black tracking-wider uppercase whitespace-nowrap leading-none"
            style={{
              WebkitTextStroke: '1px rgba(243, 108, 33, 0.45)',
              color: 'transparent',
              letterSpacing: '0.04em',
            }}
          >
            DEVICES THAT DEFINE QUALITY
          </p>
        </div>

        {/* Copyright Line */}
        <div className="pt-6 text-center text-xs text-slate-400">
          <p>
            Copyright 2026 Transact INTL, All Rights Reserved Design By: Graphixals
          </p>
        </div>
      </div>
    </footer>
  )
}
