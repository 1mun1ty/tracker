import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI SOC & Pentest Agent - Project Tracker',
  description: 'Comprehensive project management for AI-powered SOC and Pentest Agent development',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}