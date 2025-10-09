"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, Users, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export function AdminStats() {
  const stats = [
    {
      title: "Total Properties",
      value: "24",
      change: "+3 this month",
      icon: Building,
      color: "text-bitcoin-orange",
    },
    {
      title: "Active Users",
      value: "1,247",
      change: "+12% from last month",
      icon: Users,
      color: "text-stacks-purple",
    },
    {
      title: "Total Investment",
      value: "₿ 45.7",
      change: "+₿ 8.2 this month",
      icon: DollarSign,
      color: "text-success-green",
    },
    {
      title: "Monthly Revenue",
      value: "₿ 3.2",
      change: "+15% from last month",
      icon: TrendingUp,
      color: "text-success-green",
    },
    {
      title: "Pending Approvals",
      value: "7",
      change: "3 properties, 4 users",
      icon: AlertTriangle,
      color: "text-warning-amber",
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "Property funding rate",
      icon: CheckCircle,
      color: "text-success-green",
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
