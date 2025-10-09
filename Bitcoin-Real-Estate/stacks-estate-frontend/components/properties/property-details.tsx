"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Building, Shield, ExternalLink } from "lucide-react"

// Mock property data - in real app, this would come from blockchain
const mockPropertyData = {
  id: 1,
  title: "Luxury Downtown Condos",
  location: "Miami, FL",
  fullAddress: "1200 Brickell Avenue, Miami, FL 33131",
  images: [
    "/modern-luxury-condos-miami-downtown.jpg",
    "/luxury-condo-interior-miami.jpg",
    "/miami-downtown-skyline-view.jpg",
    "/luxury-condo-amenities-pool.jpg",
  ],
  description:
    "Premium luxury condominiums in the heart of Miami's financial district. This exclusive development features state-of-the-art amenities, panoramic city views, and prime location access to business and entertainment districts.",
  longDescription: `This exceptional luxury condominium development represents the pinnacle of Miami urban living. Located in the prestigious Brickell financial district, the property offers unparalleled access to Miami's business center while providing residents with world-class amenities and services.

The development features 45 floors of luxury residences, each designed with premium finishes and floor-to-ceiling windows offering breathtaking views of Biscayne Bay and the Miami skyline. Residents enjoy access to a rooftop infinity pool, state-of-the-art fitness center, concierge services, and valet parking.

The property's strategic location provides easy access to major highways, Miami International Airport, and the vibrant nightlife and dining scene that Miami is famous for. With strong rental demand from business professionals and tourists, this property offers excellent potential for consistent rental income.`,
  totalValue: "2.5M sBTC",
  totalValueUSD: "$125,000,000",
  funded: 85,
  investors: 127,
  monthlyYield: 0.7,
  annualYield: 8.4,
  timeRemaining: "5 days",
  status: "funding",
  type: "Residential",
  isVerified: true,
  minInvestment: "0.1 sBTC",
  propertyManager: "Miami Premium Properties LLC",
  yearBuilt: 2023,
  totalUnits: 180,
  avgRentPerUnit: "$3,200/month",
  occupancyRate: 95,
  propertyFeatures: [
    "Rooftop infinity pool",
    "24/7 concierge service",
    "State-of-the-art fitness center",
    "Valet parking",
    "Business center",
    "Panoramic city views",
    "Premium finishes",
    "Smart home technology",
  ],
  locationBenefits: [
    "Financial district location",
    "Walking distance to metro",
    "Close to major shopping",
    "Waterfront access",
    "Airport connectivity",
    "Entertainment district",
  ],
}

interface PropertyDetailsProps {
  propertyId: string
}

export function PropertyDetails({ propertyId }: PropertyDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const property = mockPropertyData // In real app, fetch by propertyId

  return (
    <div className="space-y-6">
      {/* Image Gallery */}
      <Card className="glass-card overflow-hidden">
        <div className="relative">
          <img
            src={property.images[selectedImage] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-96 object-cover"
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
              {property.type}
            </Badge>
          </div>
        </div>

        {/* Image Thumbnails */}
        <div className="p-4">
          <div className="flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Property Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl md:text-3xl mb-2">{property.title}</CardTitle>
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {property.fullAddress}
              </div>
            </div>
            <Button variant="outline" className="glass-card bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 glass-card rounded-lg">
              <div className="text-2xl font-bold text-primary">{property.totalValue}</div>
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-xs text-muted-foreground">{property.totalValueUSD}</div>
            </div>
            <div className="text-center p-4 glass-card rounded-lg">
              <div className="text-2xl font-bold text-accent">{property.annualYield}%</div>
              <div className="text-sm text-muted-foreground">Annual Yield</div>
              <div className="text-xs text-muted-foreground">{property.monthlyYield}% monthly</div>
            </div>
            <div className="text-center p-4 glass-card rounded-lg">
              <div className="text-2xl font-bold">{property.investors}</div>
              <div className="text-sm text-muted-foreground">Investors</div>
              <div className="text-xs text-muted-foreground">{property.funded}% funded</div>
            </div>
            <div className="text-center p-4 glass-card rounded-lg">
              <div className="text-2xl font-bold">{property.timeRemaining}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
              <div className="text-xs text-muted-foreground">to fund</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Property Details Tabs */}
      <Card className="glass-card">
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-card m-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Property Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.longDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Property Features</h4>
                    <ul className="space-y-2">
                      {property.propertyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Location Benefits</h4>
                    <ul className="space-y-2">
                      {property.locationBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Investment Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Property Value</span>
                        <span className="font-medium">{property.totalValueUSD}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Minimum Investment</span>
                        <span className="font-medium">{property.minInvestment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Expected Annual Yield</span>
                        <span className="font-medium text-accent">{property.annualYield}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Monthly Distribution</span>
                        <span className="font-medium text-accent">{property.monthlyYield}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Property Metrics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Units</span>
                        <span className="font-medium">{property.totalUnits}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Average Rent</span>
                        <span className="font-medium">{property.avgRentPerUnit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Occupancy Rate</span>
                        <span className="font-medium text-accent">{property.occupancyRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built</span>
                        <span className="font-medium">{property.yearBuilt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="location" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Location Analysis</h3>
                  <div className="glass-card p-4 rounded-lg mb-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">{property.fullAddress}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    Located in Miami's prestigious Brickell financial district, this property offers unparalleled access
                    to business centers, transportation hubs, and entertainment venues. The area has seen consistent
                    growth in property values and rental demand.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="management" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Management</h3>
                  <div className="glass-card p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Building className="h-8 w-8 text-primary mr-3" />
                      <div>
                        <h4 className="font-semibold">{property.propertyManager}</h4>
                        <p className="text-sm text-muted-foreground">Professional Property Management</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Our experienced property management team handles all aspects of property operations, including
                      tenant relations, maintenance, rent collection, and financial reporting. With over 15 years of
                      experience in luxury real estate management.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">15+</div>
                        <div className="text-sm text-muted-foreground">Years Experience</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">500+</div>
                        <div className="text-sm text-muted-foreground">Properties Managed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">98%</div>
                        <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
