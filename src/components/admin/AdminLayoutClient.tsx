'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminHeader from './AdminHeader'
import AdminSidebar from './AdminSidebar'

interface AdminLayoutClientProps {
  children: React.ReactNode
}

export default function AdminLayoutClient({ children }: AdminLayoutClientProps) {
  const pathname = usePathname()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen flex-col bg-[#05163F]/20 text-[#081022] overflow-hidden">
      {/* Top Header */}
      <AdminHeader
        onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 shrink-0 h-full">
          <AdminSidebar isOpen={true} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative z-10 w-64 bg-[#081022] h-full shadow-2xl">
              <AdminSidebar isOpen={true} onClose={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Scrollable Dashboard View */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFC] p-4 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
