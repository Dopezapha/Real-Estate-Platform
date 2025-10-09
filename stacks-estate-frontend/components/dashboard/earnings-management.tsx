"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, TrendingUp, Download, AlertCircle, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@/lib/wallet-context"
import { claimRentalEarnings } from "@/lib/stacks-transactions"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock earnings data
const earningsData = {
  totalClaimable: 0.045,
  totalClaimableUSD: 2250,
  nextDistribution: "2024-02-01",
  lastClaimed: "2024-01-01",
  monthlyEarnings: [
    { month: "January 2024", amount: 0.085, amountUSD: 4250, status: "claimed", claimDate: "2024-01-01" },
    { month: "December 2023", amount: 0.082, amountUSD: 4100, status: "claimed", claimDate: "2023-12-01" },
    { month: "November 2023", amount: 0.078, amountUSD: 3900, status: "claimed", claimDate: "2023-11-01" },
    { month: "October 2023", amount: 0.075, amountUSD: 3750, status: "claimed", claimDate: "2023-10-01" },
  ],
  pendingEarnings: [
    { propertyId: 1, propertyName: "Luxury Downtown Condos", amount: 0.018, amountUSD: 900, month: "February 2024" },
    {
      propertyId: 2,
      propertyName: "Commercial Office Complex",
      amount: 0.027,
      amountUSD: 1350,
      month: "February 2024",
    },
  ],
}

export function EarningsManagement() {
  const { isConnected, address } = useWallet()
  const [isClaiming, setIsClaiming] = useState(false)
  const [claimSuccess, setClaimSuccess] = useState(false)
  const [claimError, setClaimError] = useState<string | null>(null)
  const [txId, setTxId] = useState<string | null>(null)

  const handleClaimAll = async () => {
    if (!isConnected || !address) {
      setClaimError("Please connect your wallet first")
      return
    }

    setIsClaiming(true)
    setClaimError(null)
    setClaimSuccess(false)
    setTxId(null)

    try {
      // Claim for each pending earning
      // In a real app, you might want to batch these or claim them one by one
      for (const earning of earningsData.pendingEarnings) {
        // Parse month and year from the earning data
        const [monthName, yearStr] = earning.month.split(" ")
        const year = parseInt(yearStr)
        const monthMap: { [key: string]: number } = {
          January: 1, February: 2, March: 3, April: 4,
          May: 5, June: 6, July: 7, August: 8,
          September: 9, October: 10, November: 11, December: 12
        }
        const month = monthMap[monthName] || 2

        console.log(`Claiming earnings for property ${earning.propertyId}, ${monthName} ${year}`)
        
        await claimRentalEarnings(earning.propertyId, month, year, address)
      }

      setClaimSuccess(true)
      setTxId("Transaction submitted successfully")
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setClaimSuccess(false)
        setTxId(null)
      }, 5000)

    } catch (error: any) {
      console.error("Claim failed:", error)
      setClaimError(error.message || "Failed to claim earnings. Please try again.")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Connection Alert */}
      {!isConnected && (
        <Alert className="bg-yellow-500/10 border-yellow-500/50">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-500">
            Connect your Leather wallet to claim earnings
          </AlertDescription>
        </Alert>
      )}

      {/* Success/Error Messages */}
      <AnimatePresence>
        {claimSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="bg-green-500/10 border-green-500/50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Earnings claimed successfully! Check your wallet for the transaction.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {claimError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="bg-red-500/10 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-500">
                {claimError}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Claimable Earnings */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Claimable Earnings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 glass-card rounded-lg">
            <div className="text-3xl font-bold text-accent mb-2">{earningsData.totalClaimable} sBTC</div>
            <div className="text-lg text-muted-foreground mb-4">${earningsData.totalClaimableUSD.toLocaleString()}</div>
            <Button
              onClick={handleClaimAll}
              disabled={isClaiming || earningsData.totalClaimable === 0 || !isConnected}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground disabled:opacity-50"
            >
              {isClaiming ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Processing...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Claim All Earnings
                </>
              )}
            </Button>
            {!isConnected && (
              <p className="text-xs text-muted-foreground mt-2">
                Connect wallet to claim
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Pending by Property</h4>
            {earningsData.pendingEarnings.map((earning) => (
              <div key={earning.propertyId} className="flex justify-between items-center p-3 glass-card rounded-lg">
                <div>
                  <div className="font-medium text-sm">{earning.propertyName}</div>
                  <div className="text-xs text-muted-foreground">{earning.month}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-sm">{earning.amount} sBTC</div>
                  <div className="text-xs text-muted-foreground">${earning.amountUSD}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Earnings History */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Earnings History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {earningsData.monthlyEarnings.map((earning, index) => (
              <motion.div
                key={earning.month}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex justify-between items-center p-4 glass-card rounded-lg"
              >
                <div>
                  <div className="font-medium">{earning.month}</div>
                  <div className="text-sm text-muted-foreground">Claimed on {earning.claimDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-accent">{earning.amount} sBTC</div>
                  <div className="text-sm text-muted-foreground">${earning.amountUSD.toLocaleString()}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Total Claimed (Last 4 months)</span>
            <div className="text-right">
              <div className="font-semibold">
                {earningsData.monthlyEarnings.reduce((sum, e) => sum + e.amount, 0).toFixed(3)} sBTC
              </div>
              <div className="text-muted-foreground">
                ${earningsData.monthlyEarnings.reduce((sum, e) => sum + e.amountUSD, 0).toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Distribution */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Next Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-4">
            <div className="text-lg font-semibold mb-2">{earningsData.nextDistribution}</div>
            <div className="text-sm text-muted-foreground">Estimated earnings will be available for claiming</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
