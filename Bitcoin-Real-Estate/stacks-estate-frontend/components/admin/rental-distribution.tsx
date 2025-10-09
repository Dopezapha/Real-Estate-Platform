"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DollarSign, Calendar, Users, TrendingUp, Download, Plus } from "lucide-react"

export function RentalDistribution() {
  const [selectedMonth, setSelectedMonth] = useState("2024-01")

  const distributions = [
    {
      id: "DIST-001",
      propertyId: "PROP-001",
      propertyName: "Luxury Downtown Condos",
      month: "2024-01",
      totalRental: "₿ 1.2",
      distributed: "₿ 1.08",
      platformFee: "₿ 0.12",
      investors: 23,
      status: "completed",
      distributionDate: "2024-02-01",
    },
    {
      id: "DIST-002",
      propertyId: "PROP-002",
      propertyName: "Modern Office Complex",
      month: "2024-01",
      totalRental: "₿ 2.8",
      distributed: "₿ 2.52",
      platformFee: "₿ 0.28",
      investors: 45,
      status: "pending",
      distributionDate: "2024-02-01",
    },
    {
      id: "DIST-003",
      propertyId: "PROP-001",
      propertyName: "Luxury Downtown Condos",
      month: "2023-12",
      totalRental: "₿ 1.1",
      distributed: "₿ 0.99",
      platformFee: "₿ 0.11",
      investors: 23,
      status: "completed",
      distributionDate: "2024-01-01",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="text-success-green border-success-green">
            Completed
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-warning-amber border-warning-amber">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="text-stacks-purple border-stacks-purple">
            Processing
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const monthlyStats = {
    totalRental: "₿ 4.0",
    totalDistributed: "₿ 3.6",
    totalFees: "₿ 0.4",
    totalInvestors: 68,
    completedDistributions: 1,
    pendingDistributions: 1,
  }

  return (
    <div className="space-y-6">
      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Rental Income</CardTitle>
            <DollarSign className="h-4 w-4 text-bitcoin-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthlyStats.totalRental}</div>
            <p className="text-xs text-gray-500 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Distributed</CardTitle>
            <TrendingUp className="h-4 w-4 text-success-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthlyStats.totalDistributed}</div>
            <p className="text-xs text-gray-500 mt-1">90% of total</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Platform Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-stacks-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthlyStats.totalFees}</div>
            <p className="text-xs text-gray-500 mt-1">10% commission</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-bitcoin-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{monthlyStats.totalInvestors}</div>
            <p className="text-xs text-gray-500 mt-1">Receiving income</p>
          </CardContent>
        </Card>
      </div>

      {/* Rental Distribution Management */}
      <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rental Distribution Management</CardTitle>
              <p className="text-sm text-gray-400 mt-1">Manage monthly rental income distributions</p>
            </div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-bitcoin-orange hover:bg-bitcoin-orange/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Distribution
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>Create New Distribution</DialogTitle>
                    <DialogDescription>Set up a new rental income distribution for a property</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Property</label>
                      <Select>
                        <SelectTrigger className="bg-gray-800 border-gray-700">
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="prop-001">Luxury Downtown Condos</SelectItem>
                          <SelectItem value="prop-002">Modern Office Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Rental Amount (sBTC)</label>
                      <Input placeholder="0.00" className="bg-gray-800 border-gray-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white">Distribution Month</label>
                      <Input type="month" className="bg-gray-800 border-gray-700" />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button variant="outline" className="border-gray-700 bg-transparent">
                        Cancel
                      </Button>
                      <Button className="bg-bitcoin-orange hover:bg-bitcoin-orange/90">Create Distribution</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="border-gray-700 bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Month Filter */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40 bg-gray-800/50 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="2024-01">January 2024</SelectItem>
                  <SelectItem value="2023-12">December 2023</SelectItem>
                  <SelectItem value="2023-11">November 2023</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Distributions Table */}
          <div className="rounded-md border border-gray-800">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead>Property</TableHead>
                  <TableHead>Rental Income</TableHead>
                  <TableHead>Distribution</TableHead>
                  <TableHead>Investors</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributions
                  .filter((dist) => dist.month === selectedMonth)
                  .map((distribution) => (
                    <TableRow key={distribution.id} className="border-gray-800">
                      <TableCell>
                        <div>
                          <div className="font-medium text-white">{distribution.propertyName}</div>
                          <div className="text-xs text-gray-500">{distribution.propertyId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-white">{distribution.totalRental}</div>
                          <div className="text-xs text-gray-400">Fee: {distribution.platformFee}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-success-green">{distribution.distributed}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-white">{distribution.investors}</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(distribution.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm text-white">{distribution.distributionDate}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        {distribution.status === "pending" ? (
                          <Button size="sm" className="bg-bitcoin-orange hover:bg-bitcoin-orange/90">
                            Process
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
