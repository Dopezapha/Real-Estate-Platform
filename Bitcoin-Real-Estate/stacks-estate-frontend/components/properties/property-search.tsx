"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface PropertySearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export function PropertySearch({ searchQuery, setSearchQuery }: PropertySearchProps) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search properties by location, type, or name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 glass-card bg-transparent"
      />
    </div>
  )
}
