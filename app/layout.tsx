import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Viewport } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cashflow Monthly',
  description: 'Manage your monthly cashflow with ease',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#f8fafc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <footer className="py-6 text-center text-[10px] text-slate-400 font-medium uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">
            Made by perpahmian.ltd
          </footer>
        </div>
      </body>
    </html>
  )
}
