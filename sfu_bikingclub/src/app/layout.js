// import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'SFU Cycling Club',
  description: 'Club at SFU for Cycling enthusiast and causal riders',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-mono" suppressHydrationWarning={true}>
        {children}
        <Footer />
      </body>
    </html>
  )
}