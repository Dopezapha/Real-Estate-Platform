"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, CheckCircle, XCircle, Edit, MapPin } from "lucide-react"

export function PropertyManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const properties = [
    {
      id: "PROP-001",
      title: "Luxury Downtown Condos",
      location: "Miami, FL",
      status: "pending",
      totalValue: "₿ 12.5",
      funded: "₿ 8.3",
      fundingProgress: 66,
      investors: 23,
      submittedBy: "john.stx",
      submittedDate: "2024-01-15",
    },
    {
      id: "PROP-002",
      title: "Modern Office Complex",
      location: "Austin, TX",
      status: "approved",
      totalValue: "₿ 25.0",
      funded: "₿ 25.0",
      fundingProgress: 100,
      investors: 45,
      submittedBy: "sarah.stx",
      submittedDate: "2024-01-10",
    },
    {
      id: "PROP-003",
      title: "Suburban Rental Units",
      location: "Denver, CO",
      status: "rejected",
      totalValue: "₿ 8.2",
      funded: "₿ 0",
      fundingProgress: 0,
      investors: 0,
      submittedBy: "mike.stx",
      submittedDate: "2024-01-20",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-600 dark:text-warning-amber dark:border-warning-amber">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 dark:text-success-green dark:border-success-green">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 dark:text-error-red dark:border-error-red">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-gray-900 dark:text-white">Property Management</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Review and manage property listings</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 dark:bg-bitcoin-orange dark:hover:bg-bitcoin-orange/90 text-white">
            Add Property
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800/50 border-gray-300 dark:border-gray-700"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-300 dark:border-gray-700 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="rounded-md border border-gray-200 dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-200 dark:border-gray-800">
                <TableHead className="text-gray-700 dark:text-gray-300">Property</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Funding</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Investors</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">Submitted</TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id} className="border-gray-200 dark:border-gray-800">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{property.title}</div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.location}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{property.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(property.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {property.funded} / {property.totalValue}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{property.fundingProgress}% funded</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900 dark:text-white">{property.investors}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm text-gray-900 dark:text-white">{property.submittedBy}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{property.submittedDate}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {property.status === "pending" && (
                          <>
                            <DropdownMenuItem className="text-green-600 dark:text-success-green hover:bg-gray-100 dark:hover:bg-gray-700">
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600 dark:text-error-red hover:bg-gray-100 dark:hover:bg-gray-700">
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
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
