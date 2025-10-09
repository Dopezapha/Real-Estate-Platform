"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, ExternalLink } from "lucide-react"

interface WalletSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWalletSelect: (walletType: string) => void
}

export function WalletSelectionDialog({ open, onOpenChange, onWalletSelect }: WalletSelectionDialogProps) {
  const wallets = [
    {
      id: "leather",
      name: "Leather Wallet",
      description: "The most popular Stacks wallet with full Bitcoin integration",
      icon: "🔶",
      downloadUrl: "https://leather.io/",
    },
    {
      id: "xverse",
      name: "Xverse",
      description: "Multi-chain wallet supporting Bitcoin and Stacks",
      icon: "⚡",
      downloadUrl: "https://www.xverse.app/",
    },
    {
      id: "asigna",
      name: "Asigna",
      description: "Enterprise-grade wallet for institutional users",
      icon: "🏢",
      downloadUrl: "https://asigna.io/",
    },
    {
      id: "okx",
      name: "OKX Wallet",
      description: "Multi-chain wallet with Stacks support",
      icon: "🌐",
      downloadUrl: "https://www.okx.com/web3",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Choose a wallet to connect to StacksEstate. Make sure you have one installed before proceeding.
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {wallets.map((wallet) => (
            <Card key={wallet.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wallet.icon}</span>
                    <CardTitle className="text-lg">{wallet.name}</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                    <a href={wallet.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">{wallet.description}</CardDescription>
                <Button onClick={() => onWalletSelect(wallet.id)} className="w-full" variant="outline">
                  Connect {wallet.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>New to Stacks wallets?</strong> We recommend starting with Leather Wallet for the best experience.
            All wallets are free to download and use.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
