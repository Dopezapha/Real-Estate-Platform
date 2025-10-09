"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp, Users, Building, DollarSign } from "lucide-react"

export function PlatformAnalytics() {
  const monthlyData = [
    { month: "Jan", investments: 12.5, users: 45, properties: 3 },
    { month: "Feb", investments: 18.2, users: 67, properties: 5 },
    { month: "Mar", investments: 25.8, users: 89, properties: 7 },
    { month: "Apr", investments: 32.1, users: 112, properties: 9 },
    { month: "May", investments: 41.5, users: 134, properties: 12 },
    { month: "Jun", investments: 45.7, users: 156, properties: 15 },
  ]

  const propertyTypeData = [
    { name: "Residential", value: 45, color: "#F7931A" },
    { name: "Commercial", value: 30, color: "#6B46C1" },
    { name: "Mixed Use", value: 15, color: "#10B981" },
    { name: "Industrial", value: 10, color: "#F59E0B" },
  ]

  const userActivityData = [
    { day: "Mon", active: 234, new: 12 },
    { day: "Tue", active: 267, new: 18 },
    { day: "Wed", active: 289, new: 15 },
    { day: "Thu", active: 312, new: 22 },
    { day: "Fri", active: 298, new: 19 },
    { day: "Sat", active: 245, new: 8 },
    { day: "Sun", active: 198, new: 6 },
  ]

  const revenueData = [
    { month: "Jan", platform: 1.2, rental: 8.5 },
    { month: "Feb", platform: 1.8, rental: 12.3 },
    { month: "Mar", platform: 2.4, rental: 16.8 },
    { month: "Apr", platform: 3.1, rental: 21.2 },
    { month: "May", platform: 3.8, rental: 25.9 },
    { month: "Jun", platform: 4.2, rental: 28.7 },
  ]

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Volume</CardTitle>
            <TrendingUp className="h-4 w-4 text-bitcoin-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₿ 45.7</div>
            <p className="text-xs text-success-green mt-1">+23% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-stacks-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">1,247</div>
            <p className="text-xs text-success-green mt-1">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Properties Listed</CardTitle>
            <Building className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">24</div>
            <p className="text-xs text-success-green mt-1">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Platform Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-warning-amber" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₿ 4.2</div>
            <p className="text-xs text-success-green mt-1">+18% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Investment Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Area type="monotone" dataKey="investments" stroke="#F7931A" fill="#F7931A" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle>Property Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#6B46C1" name="Active Users" />
                  <Bar dataKey="new" fill="#F7931A" name="New Users" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle>Property Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="properties"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="platform"
                    stackId="1"
                    stroke="#F7931A"
                    fill="#F7931A"
                    name="Platform Fees"
                  />
                  <Area
                    type="monotone"
                    dataKey="rental"
                    stackId="1"
                    stroke="#6B46C1"
                    fill="#6B46C1"
                    name="Rental Income"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
