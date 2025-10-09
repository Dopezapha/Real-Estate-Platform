"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Wallet,
  Hash,
  Receipt,
} from "lucide-react"
import Link from "next/link"

export default function TransactionDetailsPage() {
  const params = useParams()
  const transactionId = params.id as string

  // Mock transaction data - in real app, fetch based on ID
  const transaction = {
    id: "TXN-001",
    hash: "0x1234567890abcdef1234567890abcdef12345678",
    type: "investment",
    status: "confirmed",
    amount: "₿ 2.5",
    property: {
      id: "PROP-001",
      name: "Luxury Downtown Condos",
      location: "Miami, FL",
    },
    timestamp: "2024-01-28T10:30:00Z",
    confirmations: 12,
    blockHeight: 2847392,
    gasUsed: "0.00045 STX",
    from: "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60",
    to: "ST15CPBCM5PD2SM7YJCN65YRFM6J2HBEXHAFE4A7C",
    contractCall: "invest-in-property",
    events: [
      {
        type: "contract-call",
        timestamp: "2024-01-28T10:30:00Z",
        description: "Investment transaction initiated",
      },
      {
        type: "confirmation",
        timestamp: "2024-01-28T10:32:15Z",
        description: "Transaction confirmed on blockchain",
      },
      {
        type: "completion",
        timestamp: "2024-01-28T10:35:30Z",
        description: "Investment successfully recorded",
      },
    ],
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
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/transactions">
            <Button variant="ghost" className="mb-4 text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Transactions
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance mb-2">Transaction Details</h1>
              <p className="text-gray-400">Transaction ID: {transaction.id}</p>
            </div>
            {getStatusBadge(transaction.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Transaction Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Amount</label>
                    <div className="text-xl font-bold text-bitcoin-orange">{transaction.amount}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <div className="text-lg font-medium text-white capitalize">{transaction.type}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Date</label>
                    <div className="text-lg text-white">{new Date(transaction.timestamp).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Time</label>
                    <div className="text-lg text-white">{new Date(transaction.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>

                <Separator className="bg-gray-800" />

                <div>
                  <label className="text-sm text-gray-400">Transaction Hash</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-gray-800 px-2 py-1 rounded text-gray-300 flex-1">
                      {transaction.hash}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.hash)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Information */}
            {transaction.property && (
              <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Property Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-gray-400">Property Name</label>
                      <div className="text-lg font-medium text-white">{transaction.property.name}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Location</label>
                      <div className="text-white">{transaction.property.location}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Property ID</label>
                      <div className="text-gray-300">{transaction.property.id}</div>
                    </div>
                  </div>
                  <Link href={`/properties/${transaction.property.id}`}>
                    <Button variant="outline" className="mt-4 border-gray-700 bg-transparent">
                      View Property Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Transaction Timeline */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Transaction Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transaction.events.map((event, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-bitcoin-orange rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{event.description}</div>
                        <div className="text-sm text-gray-400">{new Date(event.timestamp).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Blockchain Details */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Blockchain Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Confirmations</label>
                  <div className="text-lg font-bold text-success-green">{transaction.confirmations}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Block Height</label>
                  <div className="text-white">{transaction.blockHeight.toLocaleString()}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Gas Used</label>
                  <div className="text-white">{transaction.gasUsed}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Contract Call</label>
                  <div className="text-stacks-purple font-mono text-sm">{transaction.contractCall}</div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">From</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 flex-1 break-all">
                      {transaction.from}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.from)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">To</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-300 flex-1 break-all">
                      {transaction.to}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.to)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 bg-transparent"
                  onClick={() => copyToClipboard(transaction.hash)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Transaction Hash
                </Button>
                <Button variant="outline" className="w-full border-gray-700 bg-transparent">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on Explorer
                </Button>
                <Button variant="outline" className="w-full border-gray-700 bg-transparent">
                  <Receipt className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
