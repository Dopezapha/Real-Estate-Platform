"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Wallet, DollarSign, Calendar } from "lucide-react"
import { motion } from "framer-motion"

// Mock portfolio data - in real app, this would come from blockchain
const portfolioData = {
  totalInvested: 12.5, // sBTC
  totalInvestedUSD: 625000,
  currentValue: 13.2, // sBTC
  currentValueUSD: 660000,
  totalEarnings: 0.7, // sBTC
  totalEarningsUSD: 35000,
  monthlyIncome: 0.085, // sBTC
  monthlyIncomeUSD: 4250,
  properties: 4,
  averageYield: 8.2,
  performanceChange: 5.6, // percentage
  lastUpdated: "2 hours ago",
}

export function PortfolioOverview() {
  const isPositive = portfolioData.performanceChange > 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.currentValue} sBTC</div>
            <div className="text-sm text-muted-foreground mb-2">${portfolioData.currentValueUSD.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={`text-sm font-medium ${isPositive ? "text-accent" : "text-destructive"}`}>
                {isPositive ? "+" : ""}
                {portfolioData.performanceChange}%
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Invested */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.totalInvested} sBTC</div>
            <div className="text-sm text-muted-foreground mb-2">${portfolioData.totalInvestedUSD.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-xs">
                {portfolioData.properties} Properties
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Total Earnings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{portfolioData.totalEarnings} sBTC</div>
            <div className="text-sm text-muted-foreground mb-2">${portfolioData.totalEarningsUSD.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-accent font-medium">{portfolioData.averageYield}% avg yield</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Monthly Income */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{portfolioData.monthlyIncome} sBTC</div>
            <div className="text-sm text-muted-foreground mb-2">${portfolioData.monthlyIncomeUSD.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground">Updated {portfolioData.lastUpdated}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
