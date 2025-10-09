import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { CheckCircle, ArrowRight, Bitcoin, Building, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HowItWorksPage() {
  const steps = [
    {
      icon: Bitcoin,
      title: "Connect Your Wallet",
      description: "Connect your Stacks wallet to access the platform and manage your Bitcoin investments.",
    },
    {
      icon: Building,
      title: "Browse Properties",
      description:
        "Explore our curated selection of premium real estate properties available for fractional investment.",
    },
    {
      icon: TrendingUp,
      title: "Invest with Bitcoin",
      description: "Purchase property shares using sBTC, enabling Bitcoin-backed real estate investments.",
    },
    {
      icon: Shield,
      title: "Earn Rental Income",
      description: "Receive your share of rental income directly to your wallet, proportional to your investment.",
    },
  ]

  const benefits = [
    "Fractional ownership of premium real estate",
    "Bitcoin-native investment experience",
    "Transparent blockchain-based transactions",
    "Passive rental income generation",
    "Global property portfolio access",
    "Low minimum investment requirements",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">How StacksEstate Works</h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              Discover how we're revolutionizing real estate investment through Bitcoin and blockchain technology.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Simple 4-Step Process</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{step.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Why Choose StacksEstate?</h2>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-primary/5">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of investors building wealth through Bitcoin-backed real estate.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Start Investing Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
