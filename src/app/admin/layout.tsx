import React from 'react'
import AdminLayoutClient from '@/src/components/admin/AdminLayoutClient'

export const metadata = {
  title: 'Transact CMS Admin Panel | Surgical Instrument Control Center',
  description: 'Manage surgical instruments, categories, PDF catalogues, inquiries, and homepage settings.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
