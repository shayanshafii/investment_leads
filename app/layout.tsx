import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Investment Leads',
  description: 'Query investment leads by date',
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

