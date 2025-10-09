import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "StacksEstate - Bitcoin-Backed Real Estate Investment",
  description: "Invest in premium real estate with Bitcoin through Stacks blockchain. Earn rental income with sBTC.",
  generator: "v0.app",
  keywords: ["Bitcoin", "Real Estate", "Stacks", "sBTC", "Investment", "Blockchain"],
  authors: [{ name: "StacksEstate" }],
  openGraph: {
    title: "StacksEstate - Bitcoin-Backed Real Estate Investment",
    description: "Invest in premium real estate with Bitcoin through Stacks blockchain.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  )
}
