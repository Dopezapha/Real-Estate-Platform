"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

// Mock allocation data
const allocationData = [
  { name: "Residential", value: 45, amount: 5.625, color: "#F7931A" },
  { name: "Commercial", value: 35, amount: 4.375, color: "#6B46C1" },
  { name: "Hospitality", value: 15, amount: 1.875, color: "#10B981" },
  { name: "Industrial", value: 5, amount: 0.625, color: "#F59E0B" },
]

const locationData = [
  { location: "Miami, FL", amount: 2.7, percentage: 21.6 },
  { location: "Austin, TX", amount: 4.4, percentage: 35.2 },
  { location: "San Diego, CA", amount: 4.1, percentage: 32.8 },
  { location: "Denver, CO", amount: 2.0, percentage: 16.0 },
]

export function AssetAllocation() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Type Allocation */}
        <div>
          <h4 className="text-sm font-medium mb-4">By Property Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 glass-card rounded-lg">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.amount} sBTC</div>
                    <div className="text-xs text-muted-foreground">{item.value}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Geographic Allocation */}
        <div>
          <h4 className="text-sm font-medium mb-4">By Location</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="location" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#F7931A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
