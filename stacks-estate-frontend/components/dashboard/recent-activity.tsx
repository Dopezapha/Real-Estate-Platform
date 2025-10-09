"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Mock activity data
const recentActivity = [
  {
    id: 1,
    type: "investment",
    title: "Investment in Industrial Warehouse Complex",
    amount: 2.0,
    amountUSD: 100000,
    date: "2024-02-10",
    status: "completed",
    propertyId: 4,
    icon: ArrowUpRight,
    color: "text-primary",
  },
  {
    id: 2,
    type: "earnings",
    title: "Monthly earnings claimed",
    amount: 0.085,
    amountUSD: 4250,
    date: "2024-02-01",
    status: "completed",
    icon: ArrowDownLeft,
    color: "text-accent",
  },
  {
    id: 3,
    type: "distribution",
    title: "Rental income distributed - Beachfront Resort Villas",
    amount: 0.033,
    amountUSD: 1650,
    date: "2024-02-01",
    status: "completed",
    propertyId: 3,
    icon: DollarSign,
    color: "text-secondary",
  },
  {
    id: 4,
    type: "investment",
    title: "Investment in Beachfront Resort Villas",
    amount: 3.8,
    amountUSD: 190000,
    date: "2024-02-01",
    status: "completed",
    propertyId: 3,
    icon: ArrowUpRight,
    color: "text-primary",
  },
  {
    id: 5,
    type: "earnings",
    title: "Monthly earnings claimed",
    amount: 0.082,
    amountUSD: 4100,
    date: "2024-01-01",
    status: "completed",
    icon: ArrowDownLeft,
    color: "text-accent",
  },
  {
    id: 6,
    type: "investment",
    title: "Investment in Commercial Office Complex",
    amount: 4.2,
    amountUSD: 210000,
    date: "2024-01-20",
    status: "completed",
    propertyId: 2,
    icon: ArrowUpRight,
    color: "text-primary",
  },
]

export function RecentActivity() {
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Recent Activity
        </CardTitle>
        <Link href="/transactions">
          <Button variant="outline" size="sm" className="glass-card bg-transparent">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivity.slice(0, 6).map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 glass-card rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-10 h-10 rounded-full bg-muted/20 flex items-center justify-center ${activity.color}`}
                >
                  <activity.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-sm">{activity.title}</div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>{activity.date}</span>
                    <Badge variant="outline" className="text-xs">
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-semibold ${activity.color}`}>
                  {activity.type === "investment" ? "+" : ""}
                  {activity.amount} sBTC
                </div>
                <div className="text-xs text-muted-foreground">${activity.amountUSD.toLocaleString()}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
