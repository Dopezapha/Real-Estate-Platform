"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, Shield, Ban, Wallet, TrendingUp } from "lucide-react"

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const users = [
    {
      id: "USR-001",
      walletAddress: "SP1K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK60",
      displayName: "john.stx",
      status: "active",
      totalInvested: "₿ 2.5",
      properties: 5,
      joinDate: "2024-01-10",
      lastActive: "2024-01-28",
      riskLevel: "moderate",
    },
    {
      id: "USR-002",
      walletAddress: "SP2K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK61",
      displayName: "sarah.stx",
      status: "active",
      totalInvested: "₿ 8.7",
      properties: 12,
      joinDate: "2024-01-05",
      lastActive: "2024-01-28",
      riskLevel: "aggressive",
    },
    {
      id: "USR-003",
      walletAddress: "SP3K1A1PMGW2ZJCNF46NWZWHG8TS1D23EGH1KNK62",
      displayName: "mike.stx",
      status: "suspended",
      totalInvested: "₿ 0.8",
      properties: 2,
      joinDate: "2024-01-15",
      lastActive: "2024-01-25",
      riskLevel: "conservative",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="text-success-green border-success-green">
            Active
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="text-error-red border-error-red">
            Suspended
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-warning-amber border-warning-amber">
            Pending
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "conservative":
        return (
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Conservative
          </Badge>
        )
      case "moderate":
        return (
          <Badge variant="outline" className="text-warning-amber border-warning-amber">
            Moderate
          </Badge>
        )
      case "aggressive":
        return (
          <Badge variant="outline" className="text-error-red border-error-red">
            Aggressive
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <p className="text-sm text-gray-400 mt-1">Monitor and manage platform users</p>
          </div>
          <Button variant="outline" className="border-gray-700 bg-transparent">
            Export Users
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800/50 border-gray-700"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Users Table */}
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Risk Profile</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-gray-800">
                  <TableCell>
                    <div>
                      <div className="font-medium text-white">{user.displayName}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-400 mt-1">
                        <Wallet className="h-3 w-3" />
                        {user.walletAddress.slice(0, 8)}...{user.walletAddress.slice(-6)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{user.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-white">{user.totalInvested}</div>
                      <div className="text-xs text-gray-400">{user.properties} properties</div>
                    </div>
                  </TableCell>
                  <TableCell>{getRiskBadge(user.riskLevel)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-white">Joined {user.joinDate}</div>
                      <div className="text-xs text-gray-400">Last: {user.lastActive}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-gray-700">
                          <TrendingUp className="mr-2 h-4 w-4" />
                          View Portfolio
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-error-red hover:bg-gray-700">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-success-green hover:bg-gray-700">
                            <Shield className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
