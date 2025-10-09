"use client"

import { HeroSection } from "@/components/landing/hero-section"
import { FeaturedProperties } from "@/components/landing/featured-properties"
import { PlatformStats } from "@/components/landing/platform-stats"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <PlatformStats />
        <FeaturedProperties />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
