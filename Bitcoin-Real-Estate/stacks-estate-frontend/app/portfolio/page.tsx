"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PortfolioAnalytics } from "@/components/portfolio/portfolio-analytics"
import { PerformanceChart } from "@/components/portfolio/performance-chart"
import { AssetAllocation } from "@/components/portfolio/asset-allocation"
import { InvestmentGoals } from "@/components/portfolio/investment-goals"
import { useWallet } from "@/lib/wallet-context"

export default function PortfolioPage() {
  const { isConnected, isLoading } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.push("/")
    }
  }, [isConnected, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Portfolio Analytics</h1>
            <p className="text-xl text-muted-foreground">
              Detailed analysis of your real estate investment performance
            </p>
          </div>

          <div className="space-y-8">
            {/* Portfolio Analytics Overview */}
            <PortfolioAnalytics />

            {/* Charts and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <PerformanceChart />
              <AssetAllocation />
            </div>

            {/* Investment Goals */}
            <InvestmentGoals />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
