'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TransactLogoProps {
  variant?: 'light' | 'dark'
  className?: string
  width?: number
  height?: number
  showSubtitle?: boolean
}

export default function TransactLogo({
  variant = 'light',
  className = '',
  width = 175,
  height = 54,
  showSubtitle = false,
}: TransactLogoProps) {
  // Asset 27 1.svg is white paths by default
  const isLight = variant === 'light' // For dark backgrounds

  return (
    <Link href="/" className={`inline-flex items-center gap-2 group ${className}`}>
      <div className="relative flex items-center">
        <Image
          src="/Asset 27 1.svg"
          alt="Transact International"
          width={width}
          height={height}
          priority
          className={`h-auto transition-transform duration-200 group-hover:scale-[1.02] ${
            isLight ? '' : 'brightness-0 contrast-200'
          }`}
          style={{ width: `${width}px`, height: 'auto' }}
        />
      </div>
      {showSubtitle && (
        <span className={`text-[10px] tracking-[0.2em] uppercase font-semibold pl-2 border-l ${
          isLight ? 'text-zinc-400 border-zinc-700' : 'text-zinc-500 border-zinc-200'
        }`}>
          Surgical
        </span>
      )}
    </Link>
  )
}
