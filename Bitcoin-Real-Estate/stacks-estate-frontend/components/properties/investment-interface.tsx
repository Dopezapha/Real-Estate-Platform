"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useWallet } from "@/lib/wallet-context"
import { Calculator, Wallet, TrendingUp, Clock, Users, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { openContractCall } from "@stacks/connect"
import { uintCV, PostConditionMode } from "@stacks/transactions"

// Testnet network - using string identifier for compatibility
const NETWORK = 'testnet'

// Contract addresses
const CONTRACTS = {
  INVESTMENT_MANAGER: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C.investment-manager",
  SBTC_TOKEN: "ST1F7QA2MDF17S807EPA36TSS8AMEFY4KA9TVGWXT.sbtc-token",
}

// Mock property data
const mockPropertyData = {
  id: 1,
  totalValue: 2500000, // in sBTC micro-units
  funded: 85,
  investors: 127,
  monthlyYield: 0.7,
  annualYield: 8.4,
  timeRemaining: "5 days",
  minInvestment: 0.1,
  maxInvestment: 100,
  currentPrice: 50000, // sBTC price in USD
}

interface InvestmentInterfaceProps {
  propertyId: string
}

export function InvestmentInterface({ propertyId }: InvestmentInterfaceProps) {
  const { isConnected, connectWallet, address } = useWallet()
  const [investmentAmount, setInvestmentAmount] = useState(1)
  const [isInvesting, setIsInvesting] = useState(false)

  const property = mockPropertyData
  const investmentUSD = investmentAmount * property.currentPrice
  const monthlyReturn = (investmentAmount * property.monthlyYield) / 100
  const annualReturn = (investmentAmount * property.annualYield) / 100
  const ownershipPercentage = (investmentAmount / (property.totalValue / 1000000)) * 100

  const handleInvest = async () => {
    if (!isConnected) {
      connectWallet()
      return
    }

    if (!address) {
      alert("Please connect your wallet first")
      return
    }

    setIsInvesting(true)
    
    try {
      // Convert sBTC amount to micro-units (1 sBTC = 1,000,000 micro-units)
      const amountInMicroUnits = Math.floor(investmentAmount * 1000000)
      
      // Parse contract addresses
      const [investmentContractAddress, investmentContractName] = CONTRACTS.INVESTMENT_MANAGER.split('.')

      // Call the invest-in-property function on the investment-manager contract
      await openContractCall({
        network: NETWORK as any,
        contractAddress: investmentContractAddress,
        contractName: investmentContractName,
        functionName: "invest-in-property",
        functionArgs: [
          uintCV(Number.parseInt(propertyId)), // property-id
          uintCV(amountInMicroUnits), // sbtc-amount in micro-units
        ],
        postConditionMode: PostConditionMode.Allow,
        onFinish: (data: any) => {
          console.log("Transaction submitted:", data.txId)
          alert(`Investment successful! Transaction ID: ${data.txId}\n\nYou can view it on the Stacks Explorer.`)
          setIsInvesting(false)
        },
        onCancel: () => {
          console.log("Transaction cancelled by user")
          alert("Transaction cancelled")
          setIsInvesting(false)
        },
      })
      
    } catch (error: any) {
      console.error('Investment failed:', error)
      alert(`Investment failed: ${error.message || 'Unknown error'}`)
      setIsInvesting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Investment Card - REMOVED sticky top-24 */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            Investment Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Funding Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Funding Progress</span>
              <span className="font-medium">{property.funded}%</span>
            </div>
            <Progress value={property.funded} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{property.investors} investors</span>
              <span>{property.timeRemaining} remaining</span>
            </div>
          </div>

          <Separator />

          {/* Investment Amount */}
          <div className="space-y-4">
            <Label>Investment Amount (sBTC)</Label>
            <div className="space-y-3">
              <Input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Math.max(0.1, Number.parseFloat(e.target.value) || 0.1))}
                min={property.minInvestment}
                max={property.maxInvestment}
                step={0.1}
                className="glass-card bg-transparent text-lg font-medium"
              />
              <Slider
                value={[investmentAmount]}
                onValueChange={([value]) => setInvestmentAmount(value)}
                min={property.minInvestment}
                max={property.maxInvestment}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Min: {property.minInvestment} sBTC</span>
                <span>Max: {property.maxInvestment} sBTC</span>
              </div>
            </div>
          </div>

          {/* Investment Summary */}
          <div className="space-y-3 glass-card p-4 rounded-lg">
            <h4 className="font-semibold text-sm">Investment Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Investment (USD)</span>
                <span className="font-medium">${investmentUSD.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ownership</span>
                <span className="font-medium">{ownershipPercentage.toFixed(3)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Return</span>
                <span className="font-medium text-accent">{monthlyReturn.toFixed(4)} sBTC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Annual Return</span>
                <span className="font-medium text-accent">{annualReturn.toFixed(3)} sBTC</span>
              </div>
            </div>
          </div>

          {/* Investment Button */}
          <Button
            onClick={handleInvest}
            disabled={isInvesting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
          >
            {isInvesting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
              />
            ) : (
              <Wallet className="h-5 w-5 mr-2" />
            )}
            {isConnected ? (isInvesting ? "Processing..." : "Invest Now") : "Connect Wallet"}
          </Button>

          {isConnected && (
            <p className="text-xs text-muted-foreground text-center">
              Connected
            </p>
          )}
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Key Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 glass-card rounded-lg">
              <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-lg font-bold text-accent">{property.annualYield}%</div>
              <div className="text-xs text-muted-foreground">Annual Yield</div>
            </div>
            <div className="text-center p-3 glass-card rounded-lg">
              <Clock className="h-6 w-6 text-warning mx-auto mb-2" />
              <div className="text-lg font-bold">{property.timeRemaining}</div>
              <div className="text-xs text-muted-foreground">Time Left</div>
            </div>
            <div className="text-center p-3 glass-card rounded-lg">
              <Users className="h-6 w-6 text-secondary mx-auto mb-2" />
              <div className="text-lg font-bold">{property.investors}</div>
              <div className="text-xs text-muted-foreground">Investors</div>
            </div>
            <div className="text-center p-3 glass-card rounded-lg">
              <Shield className="h-6 w-6 text-accent mx-auto mb-2" />
              <div className="text-lg font-bold">Verified</div>
              <div className="text-xs text-muted-foreground">Property</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Disclosure */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Risk Disclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Real estate investments carry inherent risks including market volatility, liquidity constraints, and
            potential loss of principal. Past performance does not guarantee future results. Please review all
            documentation before investing.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
