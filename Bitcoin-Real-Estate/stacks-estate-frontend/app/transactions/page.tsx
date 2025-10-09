"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionHistory } from "@/components/transactions/transaction-history"
import { TransactionStatus } from "@/components/transactions/transaction-status"
import { PendingTransactions } from "@/components/transactions/pending-transactions"
import { TransactionStats } from "@/components/transactions/transaction-stats"
import { Receipt, Clock, CheckCircle, AlertCircle } from "lucide-react"

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Receipt className="h-8 w-8 text-bitcoin-orange" />
            <h1 className="text-3xl font-bold text-balance">Transaction Center</h1>
          </div>
          <p className="text-gray-400">Monitor and manage all your blockchain transactions</p>
        </div>

        {/* Transaction Stats */}
        <TransactionStats />

        {/* Transaction Tabs */}
        <Tabs defaultValue="history" className="mt-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Status
            </TabsTrigger>
            <TabsTrigger value="failed" className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Failed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-6">
            <TransactionHistory />
          </TabsContent>

          <TabsContent value="pending" className="mt-6">
            <PendingTransactions />
          </TabsContent>

          <TabsContent value="status" className="mt-6">
            <TransactionStatus />
          </TabsContent>

          <TabsContent value="failed" className="mt-6">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-error-red">Failed Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">No failed transactions found.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
