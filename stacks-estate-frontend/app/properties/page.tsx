"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PropertyFilters } from "@/components/properties/property-filters"
import { PropertyGrid } from "@/components/properties/property-grid"
import { PropertySearch } from "@/components/properties/property-search"

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    location: "all",
    minYield: 0,
    maxYield: 20,
    sortBy: "newest",
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Investment Properties</h1>
            <p className="text-xl text-muted-foreground">
              Discover verified real estate opportunities with transparent returns and smart contract security
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-80">
              <PropertySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <PropertyFilters filters={filters} setFilters={setFilters} />
            </div>

            {/* Properties Grid */}
            <div className="flex-1">
              <PropertyGrid searchQuery={searchQuery} filters={filters} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
