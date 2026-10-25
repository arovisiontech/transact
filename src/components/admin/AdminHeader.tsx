'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, ExternalLink, ShieldCheck, User } from 'lucide-react'

interface AdminHeaderProps {
  adminName?: string
  adminEmail?: string
  onMenuClick?: () => void
}

export default function AdminHeader({
  adminName = 'Super Administrator',
  adminEmail = 'admin@transactintl.com',
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter()

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('transact_admin_auth')
    }
    router.push('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800 bg-[#081022] text-white">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
            aria-label="Toggle admin sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="hidden sm:inline-block text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Transact International CMS
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#F6851F]" /> View Website
          </Link>

          <div className="h-6 w-px bg-zinc-800" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F6851F]/20 text-[#F6851F] flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-white">{adminName}</p>
              <p className="text-[10px] text-zinc-400 font-mono">{adminEmail}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
