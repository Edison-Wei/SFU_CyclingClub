// import { Inter } from 'next/font/google'
import { AuthProvider } from './Providers'
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
        <AuthProvider>
        {children}
        </AuthProvider>
        <Footer />
      </body>
    </html>
  )
}