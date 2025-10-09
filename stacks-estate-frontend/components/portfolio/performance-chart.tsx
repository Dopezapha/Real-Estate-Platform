"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock performance data
const performanceData = {
  "1M": [
    { date: "Jan 1", value: 100, benchmark: 100 },
    { date: "Jan 8", value: 101.2, benchmark: 100.8 },
    { date: "Jan 15", value: 102.1, benchmark: 101.2 },
    { date: "Jan 22", value: 101.8, benchmark: 101.5 },
    { date: "Jan 29", value: 102.4, benchmark: 101.8 },
  ],
  "3M": [
    { date: "Nov", value: 100, benchmark: 100 },
    { date: "Dec", value: 101.8, benchmark: 101.2 },
    { date: "Jan", value: 102.8, benchmark: 102.1 },
  ],
  "6M": [
    { date: "Aug", value: 100, benchmark: 100 },
    { date: "Sep", value: 100.8, benchmark: 100.5 },
    { date: "Oct", value: 101.2, benchmark: 101.0 },
    { date: "Nov", value: 102.1, benchmark: 101.8 },
    { date: "Dec", value: 103.5, benchmark: 102.5 },
    { date: "Jan", value: 104.1, benchmark: 103.2 },
  ],
  "1Y": [
    { date: "Feb 23", value: 100, benchmark: 100 },
    { date: "Apr 23", value: 102.1, benchmark: 101.5 },
    { date: "Jun 23", value: 103.8, benchmark: 102.8 },
    { date: "Aug 23", value: 105.2, benchmark: 104.1 },
    { date: "Oct 23", value: 106.8, benchmark: 105.5 },
    { date: "Dec 23", value: 107.5, benchmark: 106.2 },
    { date: "Feb 24", value: 108.2, benchmark: 107.1 },
  ],
}

export function PerformanceChart() {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="6M" className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="1M">1M</TabsTrigger>
            <TabsTrigger value="3M">3M</TabsTrigger>
            <TabsTrigger value="6M">6M</TabsTrigger>
            <TabsTrigger value="1Y">1Y</TabsTrigger>
          </TabsList>

          {Object.entries(performanceData).map(([period, data]) => (
            <TabsContent key={period} value={period} className="mt-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      stroke="#6B46C1"
                      fill="rgba(107, 70, 193, 0.1)"
                      name="Market Benchmark"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#F7931A"
                      fill="rgba(247, 147, 26, 0.2)"
                      name="Your Portfolio"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
