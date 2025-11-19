import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppProviders } from '@/providers/AppProviders'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Medium Platform - Share Your Stories',
  description: 'A modern publishing platform inspired by Medium',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
