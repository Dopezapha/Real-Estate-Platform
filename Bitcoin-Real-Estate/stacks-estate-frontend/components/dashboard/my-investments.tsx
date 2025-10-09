"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Eye } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

// Mock investment data
const myInvestments = [
  {
    id: 1,
    title: "Luxury Downtown Condos",
    location: "Miami, FL",
    image: "/modern-luxury-condos-miami-downtown.jpg",
    invested: 2.5, // sBTC
    investedUSD: 125000,
    currentValue: 2.7, // sBTC
    currentValueUSD: 135000,
    ownership: 0.125, // percentage
    monthlyIncome: 0.018, // sBTC
    monthlyIncomeUSD: 900,
    yield: 8.4,
    status: "active",
    investmentDate: "2024-01-15",
    nextDistribution: "2024-02-01",
  },
  {
    id: 2,
    title: "Commercial Office Complex",
    location: "Austin, TX",
    image: "/modern-office-building-austin-texas.jpg",
    invested: 4.2, // sBTC
    investedUSD: 210000,
    currentValue: 4.4, // sBTC
    currentValueUSD: 220000,
    ownership: 0.098, // percentage
    monthlyIncome: 0.034, // sBTC
    monthlyIncomeUSD: 1700,
    yield: 9.6,
    status: "active",
    investmentDate: "2024-01-20",
    nextDistribution: "2024-02-01",
  },
  {
    id: 3,
    title: "Beachfront Resort Villas",
    location: "San Diego, CA",
    image: "/beachfront-resort-villas-san-diego.jpg",
    invested: 3.8, // sBTC
    investedUSD: 190000,
    currentValue: 4.1, // sBTC
    currentValueUSD: 205000,
    ownership: 0.156, // percentage
    monthlyIncome: 0.033, // sBTC
    monthlyIncomeUSD: 1650,
    yield: 10.8,
    status: "active",
    investmentDate: "2024-02-01",
    nextDistribution: "2024-02-01",
  },
  {
    id: 4,
    title: "Industrial Warehouse Complex",
    location: "Denver, CO",
    image: "/modern-industrial-warehouse-complex-denver.jpg",
    invested: 2.0, // sBTC
    investedUSD: 100000,
    currentValue: 2.0, // sBTC
    currentValueUSD: 100000,
    ownership: 0.089, // percentage
    monthlyIncome: 0.012, // sBTC
    monthlyIncomeUSD: 600,
    yield: 7.2,
    status: "funding",
    investmentDate: "2024-02-10",
    nextDistribution: "N/A",
  },
]

export function MyInvestments() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredInvestments = myInvestments.filter((investment) => {
    if (activeTab === "all") return true
    return investment.status === activeTab
  })

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>My Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass-card">
            <TabsTrigger value="all">All ({myInvestments.length})</TabsTrigger>
            <TabsTrigger value="active">
              Active ({myInvestments.filter((i) => i.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="funding">
              Funding ({myInvestments.filter((i) => i.status === "funding").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4 mt-6">
            {filteredInvestments.map((investment, index) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 rounded-lg"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Property Image */}
                  <div className="md:w-48 flex-shrink-0">
                    <img
                      src={investment.image || "/placeholder.svg"}
                      alt={investment.title}
                      className="w-full h-32 md:h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Investment Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{investment.title}</h3>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          {investment.location}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={investment.status === "active" ? "default" : "secondary"}
                          className={investment.status === "active" ? "bg-accent" : "bg-warning"}
                        >
                          {investment.status === "active" ? "Active" : "Funding"}
                        </Badge>
                        <Link href={`/properties/${investment.id}`}>
                          <Button variant="outline" size="sm" className="glass-card bg-transparent">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Investment Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Invested</div>
                        <div className="font-semibold">{investment.invested} sBTC</div>
                        <div className="text-xs text-muted-foreground">${investment.investedUSD.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Current Value</div>
                        <div className="font-semibold">{investment.currentValue} sBTC</div>
                        <div className="text-xs text-muted-foreground">
                          ${investment.currentValueUSD.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Monthly Income</div>
                        <div className="font-semibold text-accent">{investment.monthlyIncome} sBTC</div>
                        <div className="text-xs text-muted-foreground">
                          ${investment.monthlyIncomeUSD.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Yield</div>
                        <div className="font-semibold text-accent">{investment.yield}%</div>
                        <div className="text-xs text-muted-foreground">Annual</div>
                      </div>
                    </div>

                    {/* Ownership & Distribution Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Ownership: </span>
                          <span className="font-medium">{investment.ownership}%</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Invested: </span>
                          <span className="font-medium">{investment.investmentDate}</span>
                        </div>
                      </div>
                      {investment.status === "active" && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Next distribution: </span>
                          <span className="font-medium">{investment.nextDistribution}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredInvestments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No investments found.</p>
                <Link href="/properties">
                  <Button className="mt-4 bg-primary hover:bg-primary/90">Browse Properties</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
