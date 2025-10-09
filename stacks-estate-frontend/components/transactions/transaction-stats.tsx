"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, Hash } from "lucide-react"

export function TransactionStats() {
  const stats = [
    {
      title: "Total Volume",
      value: "₿ 45.7",
      change: "+₿ 8.2 this month",
      icon: DollarSign,
      color: "text-bitcoin-orange",
    },
    {
      title: "Completed",
      value: "127",
      change: "+23 this month",
      icon: CheckCircle,
      color: "text-success-green",
    },
    {
      title: "Pending",
      value: "3",
      change: "Awaiting confirmation",
      icon: Clock,
      color: "text-warning-amber",
    },
    {
      title: "Success Rate",
      value: "98.4%",
      change: "+0.2% from last month",
      icon: TrendingUp,
      color: "text-success-green",
    },
    {
      title: "Avg Confirmation",
      value: "2.3 min",
      change: "Average time",
      icon: Hash,
      color: "text-stacks-purple",
    },
    {
      title: "Failed",
      value: "2",
      change: "This month",
      icon: AlertCircle,
      color: "text-error-red",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-gray-700 transition-colors"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
