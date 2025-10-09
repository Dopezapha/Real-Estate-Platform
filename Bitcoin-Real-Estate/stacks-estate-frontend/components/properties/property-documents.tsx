"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Eye, Shield } from "lucide-react"

const documents = [
  {
    id: 1,
    name: "Property Deed",
    type: "Legal",
    size: "2.4 MB",
    verified: true,
    description: "Official property ownership documentation",
  },
  {
    id: 2,
    name: "Financial Statements",
    type: "Financial",
    size: "1.8 MB",
    verified: true,
    description: "Detailed financial performance and projections",
  },
  {
    id: 3,
    name: "Property Inspection Report",
    type: "Technical",
    size: "5.2 MB",
    verified: true,
    description: "Professional property condition assessment",
  },
  {
    id: 4,
    name: "Insurance Documentation",
    type: "Legal",
    size: "1.1 MB",
    verified: true,
    description: "Comprehensive property insurance coverage",
  },
  {
    id: 5,
    name: "Market Analysis Report",
    type: "Research",
    size: "3.7 MB",
    verified: true,
    description: "Local market trends and comparative analysis",
  },
]

interface PropertyDocumentsProps {
  propertyId: string
}

export function PropertyDocuments({ propertyId }: PropertyDocumentsProps) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Property Documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-4 glass-card rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{doc.name}</h4>
                    {doc.verified && (
                      <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{doc.type}</Badge>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="glass-card bg-transparent">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="glass-card bg-transparent">
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
