"use client"

import { useState } from "react"
import { useWallet } from "@/lib/wallet-context"
import { investInProperty, claimRentalEarnings } from "@/lib/stacks-transactions"

export function useInvestmentTransaction() {
  const { walletAddress, isConnected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const invest = async (propertyId: number, amount: number) => {
    if (!isConnected || !walletAddress) {
      throw new Error("Wallet not connected")
    }

    setLoading(true)
    setError(null)

    try {
      const result = await investInProperty(propertyId, amount, walletAddress)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Investment failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const claimRental = async (propertyId: number, month: number, year: number) => {
    if (!isConnected || !walletAddress) {
      throw new Error("Wallet not connected")
    }

    setLoading(true)
    setError(null)

    try {
      const result = await claimRentalEarnings(propertyId, month, year, walletAddress)
      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Claim failed"
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    invest,
    claimRental,
    loading,
    error,
  }
}
