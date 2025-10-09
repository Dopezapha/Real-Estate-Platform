"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const transactions = [
    {
      id: "TXN-001",
      hash: "0x1234...5678",
      type: "investment",
      status: "confirmed",
      amount: "₿ 2.5",
      property: "Luxury Downtown Condos",
      timestamp: "2024-01-28T10:30:00Z",
      confirmations: 12,
    },
    {
      id: "TXN-002",
      hash: "0x2345...6789",
      type: "rental_claim",
      status: "confirmed",
      amount: "₿ 0.15",
      property: "Modern Office Complex",
      timestamp: "2024-01-27T14:20:00Z",
      confirmations: 24,
    },
    {
      id: "TXN-003",
      hash: "0x3456...7890",
      type: "investment",
      status: "pending",
      amount: "₿ 1.8",
      property: "Suburban Rental Units",
      timestamp: "2024-01-28T16:45:00Z",
      confirmations: 2,
    },
    {
      id: "TXN-004",
      hash: "0x4567...8901",
      type: "refund",
      status: "confirmed",
      amount: "₿ 0.5",
      property: "Failed Property Listing",
      timestamp: "2024-01-26T09:15:00Z",
      confirmations: 48,
    },
  ]

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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "investment":
        return <Badge className="bg-bitcoin-orange/20 text-bitcoin-orange border-bitcoin-orange">Investment</Badge>
      case "rental_claim":
        return <Badge className="bg-success-green/20 text-success-green border-success-green">Rental Claim</Badge>
      case "refund":
        return <Badge className="bg-stacks-purple/20 text-stacks-purple border-stacks-purple">Refund</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.hash.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Complete record of all your blockchain transactions</p>
          </div>
          <Button variant="outline" className="border-gray-700 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="rental_claim">Rental Claim</SelectItem>
              <SelectItem value="refund">Refund</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Transactions Table */}
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead>Transaction</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-gray-800">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{transaction.id}</div>
                      <div className="text-xs text-gray-400 font-mono">{transaction.hash}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(transaction.type)}</TableCell>
                  <TableCell>
                    <div className="font-medium text-bitcoin-orange">{transaction.amount}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white max-w-40 truncate">{transaction.property}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-white">{new Date(transaction.timestamp).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(transaction.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/transactions/${transaction.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
