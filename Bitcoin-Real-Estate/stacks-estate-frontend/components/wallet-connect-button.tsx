"use client"

import { useWallet } from "@/lib/wallet-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, Copy, LogOut, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function WalletConnectButton() {
  const { isConnected, address, connectWallet, disconnectWallet, isLoading } = useWallet()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const viewOnExplorer = () => {
    if (address) {
      window.open(`https://explorer.hiro.so/address/${address}?chain=testnet`, "_blank")
    }
  }

  if (!isConnected) {
    return (
      <Button onClick={connectWallet} disabled={isLoading} variant="default" className="hover:bg-primary/90 transition-all duration-200">
        <Wallet className="mr-2 h-4 w-4" />
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-200">
          <Wallet className="mr-2 h-4 w-4" />
          {address && truncateAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 glass-card">
        <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={copyAddress} className="hover:bg-accent/20 hover:text-accent cursor-pointer transition-all duration-200">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={viewOnExplorer} className="hover:bg-accent/20 hover:text-accent cursor-pointer transition-all duration-200">
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={disconnectWallet} className="text-destructive hover:bg-destructive/20 hover:text-destructive cursor-pointer transition-all duration-200">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
