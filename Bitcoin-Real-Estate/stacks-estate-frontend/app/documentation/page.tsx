import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book, Code, FileText, HelpCircle, Zap, Shield } from "lucide-react"

export default function DocumentationPage() {
  const sections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using StacksEstate platform",
      articles: [
        "Creating Your Account",
        "Connecting Your Wallet",
        "Making Your First Investment",
        "Understanding Property Tokens",
      ],
    },
    {
      icon: Code,
      title: "API Reference",
      description: "Technical documentation for developers",
      articles: ["Authentication", "Property Endpoints", "Transaction APIs", "Webhook Integration"],
    },
    {
      icon: FileText,
      title: "Investment Guide",
      description: "Comprehensive guide to real estate investing",
      articles: ["Risk Assessment", "Portfolio Diversification", "Rental Income Calculation", "Exit Strategies"],
    },
    {
      icon: Shield,
      title: "Security",
      description: "Learn about our security measures",
      articles: ["Wallet Security", "Smart Contract Audits", "Insurance Coverage", "Best Practices"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Documentation</h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              Everything you need to know about investing in real estate with Bitcoin through StacksEstate.
            </p>
          </div>
        </section>

        {/* Documentation Sections */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {sections.map((section, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <section.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {section.articles.map((article, articleIndex) => (
                        <div
                          key={articleIndex}
                          className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <span className="font-medium">{article}</span>
                          <Badge variant="secondary">Guide</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-16">Quick Links</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="text-center">
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Quick Start</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Get up and running in under 5 minutes with our quick start guide.</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Find answers to the most commonly asked questions.</CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle>Tutorials</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Step-by-step tutorials for advanced features and use cases.</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
