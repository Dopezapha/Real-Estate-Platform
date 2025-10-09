"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

interface PropertyFiltersProps {
  filters: {
    status: string
    type: string
    location: string
    minYield: number
    maxYield: number
    sortBy: string
  }
  setFilters: (filters: any) => void
}

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const resetFilters = () => {
    setFilters({
      status: "all",
      type: "all",
      location: "all",
      minYield: 0,
      maxYield: 20,
      sortBy: "newest",
    })
  }

  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Filters</CardTitle>
        <Button variant="ghost" size="sm" onClick={resetFilters}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
            <SelectTrigger className="glass-card bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="funding">Funding</SelectItem>
              <SelectItem value="funded">Funded</SelectItem>
              <SelectItem value="active">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Filter */}
        <div className="space-y-2">
          <Label>Property Type</Label>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger className="glass-card bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="hospitality">Hospitality</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <Label>Location</Label>
          <Select value={filters.location} onValueChange={(value) => setFilters({ ...filters, location: value })}>
            <SelectTrigger className="glass-card bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="miami">Miami, FL</SelectItem>
              <SelectItem value="austin">Austin, TX</SelectItem>
              <SelectItem value="san-diego">San Diego, CA</SelectItem>
              <SelectItem value="denver">Denver, CO</SelectItem>
              <SelectItem value="seattle">Seattle, WA</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Yield Range Filter */}
        <div className="space-y-2">
          <Label>Annual Yield Range</Label>
          <div className="px-2">
            <Slider
              value={[filters.minYield, filters.maxYield]}
              onValueChange={([min, max]) => setFilters({ ...filters, minYield: min, maxYield: max })}
              max={20}
              min={0}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{filters.minYield}%</span>
              <span>{filters.maxYield}%</span>
            </div>
          </div>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label>Sort By</Label>
          <Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
            <SelectTrigger className="glass-card bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="yield-high">Highest Yield</SelectItem>
              <SelectItem value="yield-low">Lowest Yield</SelectItem>
              <SelectItem value="value-high">Highest Value</SelectItem>
              <SelectItem value="value-low">Lowest Value</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
