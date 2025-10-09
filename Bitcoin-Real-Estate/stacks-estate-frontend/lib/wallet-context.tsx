"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { connect, disconnect, getLocalStorage, isConnected, request } from "@stacks/connect"

// Type definitions for Stacks Connect response
interface AddressInfo {
  address: string
}

interface ConnectResponse {
  addresses?: {
    stx?: AddressInfo[]
    btc?: AddressInfo[]
  }
}

interface SignatureResponse {
  signature: string
  publicKey: string
}

interface WalletContextType {
  isConnected: boolean
  address: string | null
  walletAddress: string | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  isLoading: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if wallet is already connected on mount
    const checkConnection = () => {
      if (isConnected()) {
        const userData = getLocalStorage()
        if (userData?.addresses?.stx && userData.addresses.stx.length > 0) {
          const stxAddress = userData.addresses.stx[0].address
          setAddress(stxAddress)
          setConnected(true)
        }
      }
    }
    checkConnection()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)

    try {
      // Step 1: Connect to wallet
      console.log("[v0] Step 1: Connecting to wallet...")
      const response = (await connect()) as ConnectResponse

      console.log("[v0] Connection response:", response)

      // Get the address from response
      const stxAddresses = response?.addresses?.stx
      let userAddress: string | null = null

      if (stxAddresses && stxAddresses.length > 0 && stxAddresses[0]?.address) {
        userAddress = stxAddresses[0].address
      } else {
        // Fallback to local storage
        const userData = getLocalStorage()
        if (userData?.addresses?.stx && userData.addresses.stx.length > 0) {
          userAddress = userData.addresses.stx[0].address
        }
      }

      if (!userAddress) {
        throw new Error("Failed to get wallet address")
      }

      console.log("[v0] Wallet connected:", userAddress)

      // Step 2: Request message signature for authentication
      console.log("[v0] Step 2: Requesting signature for authentication...")
      const message = `Sign this message to authenticate with StacksEstate.\n\nTimestamp: ${new Date().toISOString()}\nAddress: ${userAddress}`

      try {
        const signResponse = (await request("stx_signMessage", {
          message,
        })) as SignatureResponse

        console.log("[v0] Message signed successfully:", signResponse)

        // Step 3: Set connected state after successful signature
        setAddress(userAddress)
        setConnected(true)
        console.log("[v0] Authentication complete! User is now connected:", userAddress)
      } catch (signError: any) {
        console.error("[v0] Failed to sign message:", signError)
        // Disconnect if user refuses to sign
        disconnect()
        throw new Error("Authentication failed: Message signing is required")
      }
    } catch (error: any) {
      // Handle user cancellation gracefully
      if (error?.message?.includes("cancel") || error?.message?.includes("Cancel")) {
        console.log("[v0] User canceled wallet connection")
      } else {
        console.error("[v0] Failed to connect wallet:", error)
      }
      // Reset state on error
      setAddress(null)
      setConnected(false)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = () => {
    disconnect()
    setAddress(null)
    setConnected(false)
    console.log("[v0] User disconnected")
  }

  return (
    <WalletContext.Provider
      value={{
        isConnected: connected,
        address,
        walletAddress: address,
        connectWallet,
        disconnectWallet,
        isLoading,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
