import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Transact International | Precision Surgical & Medical Instruments Manufacturing',
  description:
    'Global precision manufacturing and export of hospital-grade surgical, dental, orthopedic, and diagnostic instruments. Certified ISO 13485:2016 & CE Mark.',
  icons: {
    icon: '/Asset 27 1.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  )
}
