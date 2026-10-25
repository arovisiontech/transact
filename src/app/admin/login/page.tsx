'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import TransactLogo from '@/src/components/public/TransactLogo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@transactintl.com')
  const [password, setPassword] = useState('••••••••••••')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      toast.success('Welcome back, Administrator!')
      router.push('/admin')
    }, 600)
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast.success('Logged in with Demo Administrator credentials')
      router.push('/admin')
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#081022] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Decorative Brand Gradient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F6851F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#05163F] rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Storefront</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#F6851F]" />
          <span>Secure Admin Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <div className="bg-[#05163F]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-block">
              <TransactLogo variant="light" width={180} />
            </div>
            <p className="text-xs text-zinc-400">
              Sign in to manage surgical catalog, categories, pricing, and B2B RFQs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@transactintl.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F6851F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1.5">Master Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#F6851F]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#F6851F] focus:ring-[#F6851F]" />
                <span>Remember this terminal</span>
              </label>
              <a href="#" className="hover:text-[#F6851F] transition">Forgot?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#F6851F] hover:bg-[#E07314] text-white text-xs font-black uppercase tracking-wider transition shadow-lg shadow-[#F6851F]/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-zinc-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F6851F]" />
              <span>1-Click Demo Admin Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-zinc-500 relative z-10 py-4">
        Transact International CMS &bull; ISO 13485:2016 Compliant Enterprise Store
      </div>
    </div>
  )
}
