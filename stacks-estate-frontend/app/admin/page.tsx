"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AdminStats } from "@/components/admin/admin-stats"
import { PropertyManagement } from "@/components/admin/property-management"
import { UserManagement } from "@/components/admin/user-management"
import { RentalDistribution } from "@/components/admin/rental-distribution"
import { PlatformAnalytics } from "@/components/admin/platform-analytics"
import { ThemeToggle } from "@/components/theme-toggle"
import { Shield, Building, Users, DollarSign, BarChart3 } from "lucide-react"
import { submitProperty } from "@/lib/admin-transactions"

export default function AdminDashboard() {
  const handleCreateTestProperty = async () => {
    try {
      await submitProperty(
        "Test Property 5",
        "A comprehensive test property for development and testing purposes",
        "Miami, FL",
        "residential",
        1000, // 1000 sBTC
        10,   // 2 sBTC monthly rent
        1,    // 1 sBTC min investment
        "ipfs://test",
        30,   // 30 days
        50    // 50% threshold
      )
      alert("Property creation transaction submitted! Check your wallet.")
    } catch (error) {
      console.error("Failed to create property:", error)
      alert(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-orange-500 dark:text-bitcoin-orange" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                onClick={handleCreateTestProperty}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                TEST: Create Property 5
              </Button>
              <ThemeToggle />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Manage properties, users, and platform operations</p>
        </div>


        <AdminStats />

        <Tabs defaultValue="properties" className="mt-8">
          <TabsList className="grid w-full grid-cols-5 bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800">
            <TabsTrigger value="properties" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Properties
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="rentals" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Rentals
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="mt-6">
            <PropertyManagement />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="rentals" className="mt-6">
            <RentalDistribution />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <PlatformAnalytics />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border-gray-200 dark:border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Platform Settings</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">Configure platform parameters and security settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}