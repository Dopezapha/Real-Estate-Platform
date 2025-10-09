"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Search, ExternalLink, Copy, CheckCircle, Clock, AlertCircle, Hash } from "lucide-react"

export function TransactionStatus() {
  const [searchHash, setSearchHash] = useState("")
  const [searchResult, setSearchResult] = useState<any>(null)

  const handleSearch = () => {
    // Mock search result - in real app, query blockchain
    if (searchHash) {
      setSearchResult({
        hash: searchHash,
        status: "confirmed",
        confirmations: 15,
        blockHeight: 2847392,
        timestamp: "2024-01-28T10:30:00Z",
        amount: "₿ 2.5",
        from: "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60",
        to: "ST15CPBCM5PD2SM7YJCNF46NWZWHG8TS1D23EGH1KNK60",
        gasUsed: "0.00045 STX",
        type: "investment",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge variant="outline" className="text-success-green border-success-green">
            <CheckCircle className="h-3 w-3 mr-1" />
            Confirmed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-warning-amber border-warning-amber">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="text-error-red border-error-red">
            <AlertCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Transaction Lookup */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Transaction Lookup
          </CardTitle>
          <p className="text-sm text-gray-400">Enter a transaction hash to check its status on the blockchain</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter transaction hash (0x...)"
              value={searchHash}
              onChange={(e) => setSearchHash(e.target.value)}
              className="bg-gray-800/50 border-gray-700 font-mono"
            />
            <Button onClick={handleSearch} className="bg-bitcoin-orange hover:bg-bitcoin-orange/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Result */}
      {searchResult && (
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transaction Status</CardTitle>
              {getStatusBadge(searchResult.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Transaction Hash */}
            <div>
              <label className="text-sm text-gray-400 block mb-2">Transaction Hash</label>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-gray-800 px-3 py-2 rounded text-gray-300 flex-1 break-all">
                  {searchResult.hash}
                </code>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(searchResult.hash)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Transaction Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Amount</label>
                  <div className="text-xl font-bold text-bitcoin-orange">{searchResult.amount}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Type</label>
                  <div className="text-lg text-white capitalize">{searchResult.type}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Timestamp</label>
                  <div className="text-white">{new Date(searchResult.timestamp).toLocaleString()}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Confirmations</label>
                  <div className="text-xl font-bold text-success-green">{searchResult.confirmations}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Block Height</label>
                  <div className="text-white">{searchResult.blockHeight.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Gas Used</label>
                  <div className="text-white">{searchResult.gasUsed}</div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">From Address</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-800 px-3 py-2 rounded text-gray-300 flex-1 break-all">
                    {searchResult.from}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(searchResult.from)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">To Address</label>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-gray-800 px-3 py-2 rounded text-gray-300 flex-1 break-all">
                    {searchResult.to}
                  </code>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(searchResult.to)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Confirmation Progress */}
            {searchResult.status === "pending" && (
              <div>
                <label className="text-sm text-gray-400 block mb-2">Confirmation Progress</label>
                <Progress value={75} className="h-3" />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>3 / 6 confirmations</span>
                  <span>~2 minutes remaining</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Network Status */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Network Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success-green">2,847,392</div>
              <div className="text-sm text-gray-400">Latest Block</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bitcoin-orange">2.3 min</div>
              <div className="text-sm text-gray-400">Avg Block Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stacks-purple">0.00045</div>
              <div className="text-sm text-gray-400">Avg Gas Price (STX)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
