"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Mock analytics data
const performanceData = [
  { month: "Jan", value: 45000, yield: 8.2 },
  { month: "Feb", value: 47000, yield: 8.3 },
  { month: "Mar", value: 48500, yield: 8.4 },
  { month: "Apr", value: 49200, yield: 8.5 },
  { month: "May", value: 50100, yield: 8.4 },
  { month: "Jun", value: 51000, yield: 8.6 },
]

const investorData = [
  { range: "0.1-1 sBTC", count: 45, percentage: 35 },
  { range: "1-5 sBTC", count: 52, percentage: 41 },
  { range: "5-10 sBTC", count: 20, percentage: 16 },
  { range: "10+ sBTC", count: 10, percentage: 8 },
]

const COLORS = ["#F7931A", "#6B46C1", "#10B981", "#F59E0B"]

interface PropertyAnalyticsProps {
  propertyId: string
}

export function PropertyAnalytics({ propertyId }: PropertyAnalyticsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Property Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F7931A" fill="rgba(247, 147, 26, 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="investors" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64">
                <h4 className="text-sm font-medium mb-4">Investment Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={investorData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ range, percentage }) => `${range}: ${percentage}%`}
                    >
                      {investorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Investor Breakdown</h4>
                {investorData.map((item, index) => (
                  <div key={item.range} className="flex items-center justify-between p-3 glass-card rounded-lg">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-sm">{item.range}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.count} investors</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Line type="monotone" dataKey="yield" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
