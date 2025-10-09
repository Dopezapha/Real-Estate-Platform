"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react"

export function PendingTransactions() {
  const pendingTransactions = [
    {
      id: "TXN-003",
      hash: "0x3456...7890",
      type: "investment",
      amount: "₿ 1.8",
      property: "Suburban Rental Units",
      timestamp: "2024-01-28T16:45:00Z",
      confirmations: 2,
      requiredConfirmations: 6,
      estimatedTime: "4 minutes",
      priority: "normal",
    },
    {
      id: "TXN-005",
      hash: "0x5678...9012",
      type: "rental_claim",
      amount: "₿ 0.08",
      property: "Downtown Office Building",
      timestamp: "2024-01-28T17:20:00Z",
      confirmations: 1,
      requiredConfirmations: 3,
      estimatedTime: "2 minutes",
      priority: "high",
    },
  ]

  const getConfirmationProgress = (current: number, required: number) => {
    return (current / required) * 100
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-error-red/20 text-error-red border-error-red">High Priority</Badge>
      case "normal":
        return <Badge className="bg-warning-amber/20 text-warning-amber border-warning-amber">Normal</Badge>
      case "low":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500">Low Priority</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Pending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-warning-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{pendingTransactions.length}</div>
            <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Pending Value</CardTitle>
            <AlertTriangle className="h-4 w-4 text-bitcoin-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₿ 1.88</div>
            <p className="text-xs text-gray-500 mt-1">In pending transactions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Avg Confirmation Time</CardTitle>
            <CheckCircle className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3.2 min</div>
            <p className="text-xs text-gray-500 mt-1">Current network average</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Transactions List */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pending Transactions</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Transactions awaiting blockchain confirmation</p>
            </div>
            <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingTransactions.map((transaction) => (
              <div key={transaction.id} className="border border-gray-800 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-white">{transaction.id}</h3>
                      {getPriorityBadge(transaction.priority)}
                    </div>
                    <p className="text-sm text-gray-400 font-mono">{transaction.hash}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-bitcoin-orange">{transaction.amount}</div>
                    <div className="text-sm text-gray-400 capitalize">{transaction.type.replace("_", " ")}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-sm text-white mb-1">{transaction.property}</div>
                  <div className="text-xs text-gray-400">
                    Submitted {new Date(transaction.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Confirmations</span>
                    <span className="text-white">
                      {transaction.confirmations} / {transaction.requiredConfirmations}
                    </span>
                  </div>
                  <Progress
                    value={getConfirmationProgress(transaction.confirmations, transaction.requiredConfirmations)}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Estimated time: {transaction.estimatedTime}</span>
                    <span className="text-gray-500">
                      {Math.round(
                        getConfirmationProgress(transaction.confirmations, transaction.requiredConfirmations),
                      )}
                      % complete
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Cancel Transaction
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {pendingTransactions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-success-green mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No Pending Transactions</h3>
              <p className="text-gray-400">All your transactions have been confirmed!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
