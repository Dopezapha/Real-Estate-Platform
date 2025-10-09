"use client"

import { useParams } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { PropertyDetails } from "@/components/properties/property-details"
import { InvestmentInterface } from "@/components/properties/investment-interface"
import { PropertyAnalytics } from "@/components/properties/property-analytics"
import { PropertyDocuments } from "@/components/properties/property-documents"

export default function PropertyDetailPage() {
  const params = useParams()
  const propertyId = params.id as string

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <PropertyDetails propertyId={propertyId} />
              <PropertyAnalytics propertyId={propertyId} />
              <PropertyDocuments propertyId={propertyId} />
            </div>

            {/* Investment Sidebar */}
            <div className="lg:col-span-1">
              <InvestmentInterface propertyId={propertyId} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
