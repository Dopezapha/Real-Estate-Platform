"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, DollarSign, Percent } from "lucide-react"
import { motion } from "framer-motion"

// Mock detailed analytics data
const analyticsData = {
  totalReturn: 5.6, // percentage
  totalReturnAmount: 0.7, // sBTC
  totalReturnUSD: 35000,
  annualizedReturn: 8.2, // percentage
  sharpeRatio: 1.24,
  volatility: 12.3, // percentage
  maxDrawdown: -2.1, // percentage
  timeWeightedReturn: 8.7, // percentage
  irr: 9.1, // percentage
  diversificationScore: 85, // out of 100
  riskScore: "Moderate",
  performancePeriods: {
    "1M": 1.2,
    "3M": 2.8,
    "6M": 4.1,
    "1Y": 8.2,
    All: 5.6,
  },
}

export function PortfolioAnalytics() {
  const isPositive = analyticsData.totalReturn > 0

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Return</CardTitle>
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-accent" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${isPositive ? "text-accent" : "text-destructive"}`}>
                {isPositive ? "+" : ""}
                {analyticsData.totalReturn}%
              </div>
              <div className="text-sm text-muted-foreground">
                {analyticsData.totalReturnAmount} sBTC (${analyticsData.totalReturnUSD.toLocaleString()})
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Annualized Return</CardTitle>
              <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{analyticsData.annualizedReturn}%</div>
              <div className="text-sm text-muted-foreground">IRR: {analyticsData.irr}%</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.sharpeRatio}</div>
              <div className="text-sm text-muted-foreground">Risk-adjusted return</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.riskScore}</div>
              <div className="text-sm text-muted-foreground">Volatility: {analyticsData.volatility}%</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Performance Periods */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance by Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(analyticsData.performancePeriods).map(([period, performance], index) => (
              <motion.div
                key={period}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-4 glass-card rounded-lg"
              >
                <div className="text-sm text-muted-foreground mb-2">{period}</div>
                <div className={`text-lg font-bold ${performance > 0 ? "text-accent" : "text-destructive"}`}>
                  {performance > 0 ? "+" : ""}
                  {performance}%
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Volatility</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{analyticsData.volatility}%</div>
            <p className="text-sm text-muted-foreground">Standard deviation of returns over the past year</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Max Drawdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-destructive">{analyticsData.maxDrawdown}%</div>
            <p className="text-sm text-muted-foreground">Largest peak-to-trough decline in portfolio value</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Diversification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2 text-accent">{analyticsData.diversificationScore}/100</div>
            <p className="text-sm text-muted-foreground">
              Portfolio diversification across property types and locations
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
