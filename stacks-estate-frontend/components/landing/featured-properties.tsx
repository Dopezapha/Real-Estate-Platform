"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Downtown Condos",
    location: "Miami, FL",
    image: "/modern-luxury-condos-miami-downtown.jpg",
    totalValue: "2.5M sBTC",
    funded: 85,
    investors: 127,
    monthlyYield: "0.7%",
    timeRemaining: "5 days",
    status: "funding" as const,
    type: "Residential",
  },
  {
    id: 2,
    title: "Commercial Office Complex",
    location: "Austin, TX",
    image: "/modern-office-building-austin-texas.jpg",
    totalValue: "4.2M sBTC",
    funded: 92,
    investors: 203,
    monthlyYield: "0.8%",
    timeRemaining: "2 days",
    status: "funding" as const,
    type: "Commercial",
  },
  {
    id: 3,
    title: "Beachfront Resort Villas",
    location: "San Diego, CA",
    image: "/beachfront-resort-villas-san-diego.jpg",
    totalValue: "3.8M sBTC",
    funded: 100,
    investors: 156,
    monthlyYield: "0.9%",
    timeRemaining: "Funded",
    status: "funded" as const,
    type: "Hospitality",
  },
]

export function FeaturedProperties() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Investment Opportunities</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover premium real estate investments with verified properties and transparent returns
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="glass-card overflow-hidden hover:scale-105 transition-transform duration-300">
                <div className="relative">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      variant={property.status === "funded" ? "default" : "secondary"}
                      className={property.status === "funded" ? "bg-accent" : "bg-warning"}
                    >
                      {property.status === "funded" ? "Funded" : "Funding"}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="glass">
                      {property.type}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <h3 className="text-xl font-semibold">{property.title}</h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-semibold">{property.totalValue}</span>
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
                      <div className="text-sm font-medium text-accent">{property.monthlyYield}</div>
                      <div className="text-xs text-muted-foreground">Monthly</div>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <Button size="lg" variant="outline" className="glass-card bg-transparent">
              View All Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
