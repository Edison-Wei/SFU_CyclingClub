import type { Metadata } from "next";
import "./globals.css";
import AppFooter from "@/components/AppFooter";
import AppHeader from "@/components/AppHeader";


export const metadata: Metadata = {
  title: 'SFU Cycling Club',
  description: 'Club at SFU for Cycling enthusiast and causal riders',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full"
      // className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <link rel="icon" href="/logo.jpg" sizes="any" />
      <body className="font-roboto min-h-screen flex flex-col" suppressHydrationWarning={true}>
        <AppHeader />
        {/* <AuthProvider > */}
        <main className="flex-1">
          {children}
        </main>
        <AppFooter />
      </body>
    </html>
  );
}
