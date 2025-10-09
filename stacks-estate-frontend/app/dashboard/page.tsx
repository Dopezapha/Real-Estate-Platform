"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { PortfolioOverview } from "@/components/dashboard/portfolio-overview"
import { MyInvestments } from "@/components/dashboard/my-investments"
import { EarningsManagement } from "@/components/dashboard/earnings-management"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useWallet } from "@/lib/wallet-context"

export default function DashboardPage() {
  const { isConnected, isLoading } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.push("/auth/signin")
    }
  }, [isConnected, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Investment Dashboard</h1>
            <p className="text-xl text-muted-foreground">Track your real estate investments and earnings</p>
          </div>

          <div className="space-y-8">
            {/* Portfolio Overview */}
            <PortfolioOverview />

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Investments */}
              <div className="lg:col-span-2 space-y-8">
                <MyInvestments />
                <RecentActivity />
              </div>

              {/* Right Column - Earnings */}
              <div className="lg:col-span-1">
                <EarningsManagement />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
