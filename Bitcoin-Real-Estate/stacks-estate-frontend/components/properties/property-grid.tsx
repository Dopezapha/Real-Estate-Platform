"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Mock data - in real app, this would come from API/blockchain
const mockProperties = [
  {
    id: 1,
    title: "Luxury Downtown Condos",
    location: "Miami, FL",
    image: "/modern-luxury-condos-miami-downtown.jpg",
    totalValue: "2.5M sBTC",
    totalValueNumeric: 2500000,
    funded: 85,
    investors: 127,
    monthlyYield: 0.7,
    annualYield: 8.4,
    timeRemaining: "5 days",
    status: "funding",
    type: "residential",
    isVerified: true,
    minInvestment: "0.1 sBTC",
    description: "Premium luxury condominiums in the heart of Miami's financial district.",
  },
  {
    id: 2,
    title: "Commercial Office Complex",
    location: "Austin, TX",
    image: "/modern-office-building-austin-texas.jpg",
    totalValue: "4.2M sBTC",
    totalValueNumeric: 4200000,
    funded: 92,
    investors: 203,
    monthlyYield: 0.8,
    annualYield: 9.6,
    timeRemaining: "2 days",
    status: "funding",
    type: "commercial",
    isVerified: true,
    minInvestment: "0.5 sBTC",
    description: "Modern office complex with long-term corporate tenants.",
  },
  {
    id: 3,
    title: "Beachfront Resort Villas",
    location: "San Diego, CA",
    image: "/beachfront-resort-villas-san-diego.jpg",
    totalValue: "3.8M sBTC",
    totalValueNumeric: 3800000,
    funded: 100,
    investors: 156,
    monthlyYield: 0.9,
    annualYield: 10.8,
    timeRemaining: "Funded",
    status: "funded",
    type: "hospitality",
    isVerified: true,
    minInvestment: "0.2 sBTC",
    description: "Luxury beachfront villas with vacation rental income.",
  },
  // Add more mock properties...
  {
    id: 4,
    title: "Industrial Warehouse Complex",
    location: "Denver, CO",
    image: "/modern-industrial-warehouse-complex-denver.jpg",
    totalValue: "1.8M sBTC",
    totalValueNumeric: 1800000,
    funded: 67,
    investors: 89,
    monthlyYield: 0.6,
    annualYield: 7.2,
    timeRemaining: "12 days",
    status: "funding",
    type: "industrial",
    isVerified: true,
    minInvestment: "0.3 sBTC",
    description: "Strategic warehouse facility with e-commerce tenants.",
  },
  {
    id: 5,
    title: "Tech Campus Expansion",
    location: "Seattle, WA",
    image: "/modern-tech-campus-office-building-seattle.jpg",
    totalValue: "5.5M sBTC",
    totalValueNumeric: 5500000,
    funded: 43,
    investors: 78,
    monthlyYield: 0.75,
    annualYield: 9.0,
    timeRemaining: "18 days",
    status: "funding",
    type: "commercial",
    isVerified: true,
    minInvestment: "0.4 sBTC",
    description: "Expansion of major tech company campus facilities.",
  },
]

interface PropertyGridProps {
  searchQuery: string
  filters: {
    status: string
    type: string
    location: string
    minYield: number
    maxYield: number
    sortBy: string
  }
}

export function PropertyGrid({ searchQuery, filters }: PropertyGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 6

  const filteredProperties = useMemo(() => {
    const filtered = mockProperties.filter((property) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !property.title.toLowerCase().includes(query) &&
          !property.location.toLowerCase().includes(query) &&
          !property.type.toLowerCase().includes(query)
        ) {
          return false
        }
      }

      // Status filter
      if (filters.status !== "all" && property.status !== filters.status) {
        return false
      }

      // Type filter
      if (filters.type !== "all" && property.type !== filters.type) {
        return false
      }

      // Location filter
      if (filters.location !== "all") {
        const locationMap: { [key: string]: string } = {
          miami: "Miami, FL",
          austin: "Austin, TX",
          "san-diego": "San Diego, CA",
          denver: "Denver, CO",
          seattle: "Seattle, WA",
        }
        if (property.location !== locationMap[filters.location]) {
          return false
        }
      }

      // Yield filter
      if (property.annualYield < filters.minYield || property.annualYield > filters.maxYield) {
        return false
      }

      return true
    })

    // Sort properties
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => b.id - a.id)
        break
      case "oldest":
        filtered.sort((a, b) => a.id - b.id)
        break
      case "yield-high":
        filtered.sort((a, b) => b.annualYield - a.annualYield)
        break
      case "yield-low":
        filtered.sort((a, b) => a.annualYield - b.annualYield)
        break
      case "value-high":
        filtered.sort((a, b) => b.totalValueNumeric - a.totalValueNumeric)
        break
      case "value-low":
        filtered.sort((a, b) => a.totalValueNumeric - b.totalValueNumeric)
        break
    }

    return filtered
  }, [searchQuery, filters])

  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage)
  const startIndex = (currentPage - 1) * propertiesPerPage
  const currentProperties = filteredProperties.slice(startIndex, startIndex + propertiesPerPage)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + propertiesPerPage, filteredProperties.length)} of{" "}
          {filteredProperties.length} properties
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentProperties.map((property, index) => (
          <motion.div
            key={property.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="glass-card overflow-hidden hover:scale-105 transition-all duration-300 group">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge
                    variant={property.status === "funded" ? "default" : "secondary"}
                    className={property.status === "funded" ? "bg-accent" : "bg-warning"}
                  >
                    {property.status === "funded" ? "Funded" : "Funding"}
                  </Badge>
                  {property.isVerified && (
                    <Badge variant="outline" className="glass bg-accent/20 text-accent border-accent/30">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="glass">
                    {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{property.title}</h3>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{property.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="font-semibold">{property.totalValue}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Min Investment</span>
                  <span className="font-semibold">{property.minInvestment}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Funded</span>
                    <span>{property.funded}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${property.funded}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium">{property.investors}</div>
                    <div className="text-xs text-muted-foreground">Investors</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <TrendingUp className="h-4 w-4 text-accent" />
                    </div>
                    <div className="text-sm font-medium text-accent">{property.annualYield}%</div>
                    <div className="text-xs text-muted-foreground">Annual</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium">{property.timeRemaining}</div>
                    <div className="text-xs text-muted-foreground">Remaining</div>
                  </div>
                </div>

                <Link href={`/properties/${property.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    {property.status === "funded" ? "View Details" : "Invest Now"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="glass-card bg-transparent"
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-primary" : "glass-card bg-transparent"}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="glass-card bg-transparent"
          >
            Next
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No properties match your current filters.</p>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}
    </div>
  )
}
