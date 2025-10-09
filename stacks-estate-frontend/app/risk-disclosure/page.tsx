import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AlertTriangle, TrendingDown, Shield, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RiskDisclosurePage() {
  const risks = [
    {
      icon: TrendingDown,
      title: "Market Risk",
      description:
        "Property values and cryptocurrency prices can fluctuate significantly, potentially resulting in loss of principal.",
    },
    {
      icon: AlertTriangle,
      title: "Liquidity Risk",
      description:
        "Property tokens may not always be easily tradeable, and you may not be able to exit your investment when desired.",
    },
    {
      icon: Shield,
      title: "Technology Risk",
      description:
        "Blockchain technology and smart contracts may contain bugs or vulnerabilities that could affect your investment.",
    },
    {
      icon: Info,
      title: "Regulatory Risk",
      description:
        "Changes in laws and regulations could impact the platform's operations and your investment returns.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-8">Risk Disclosure</h1>
          <div className="text-muted-foreground mb-8">Last updated: September 28, 2025</div>

          <Alert className="mb-8 border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important Notice</AlertTitle>
            <AlertDescription>
              All investments carry risk of loss. Please read this disclosure carefully and consult with a financial
              advisor before making any investment decisions.
            </AlertDescription>
          </Alert>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-6 text-foreground">Key Risk Factors</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {risks.map((risk, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                          <risk.icon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <CardTitle className="text-lg">{risk.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{risk.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Investment Risks</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Real Estate Risks</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Property values may decline due to market conditions, location factors, or economic downturns</li>
                  <li>Rental income may fluctuate based on occupancy rates and market rents</li>
                  <li>Properties may require unexpected maintenance or capital improvements</li>
                  <li>Natural disasters or other events may damage properties</li>
                </ul>

                <h3 className="text-xl font-medium mt-6">Cryptocurrency Risks</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Bitcoin and sBTC prices are highly volatile and can change rapidly</li>
                  <li>Regulatory changes could affect cryptocurrency usage and value</li>
                  <li>Technical issues with blockchain networks may impact transactions</li>
                  <li>Loss of private keys could result in permanent loss of funds</li>
                </ul>

                <h3 className="text-xl font-medium mt-6">Platform Risks</h3>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Smart contract bugs or vulnerabilities could affect platform operations</li>
                  <li>The platform is subject to operational and business risks</li>
                  <li>Changes to platform terms or fee structure may occur</li>
                  <li>Platform may cease operations or change business model</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Risk Mitigation</h2>
              <p className="mb-4">
                While we cannot eliminate all risks, we take several measures to help protect investors:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Thorough due diligence on all properties before listing</li>
                <li>Professional property management and maintenance</li>
                <li>Insurance coverage on all properties</li>
                <li>Regular security audits of smart contracts</li>
                <li>Diversification across multiple properties and markets</li>
                <li>Transparent reporting and regular updates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Important Disclaimers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong>No Guarantee of Returns:</strong> Past performance does not guarantee future results. All
                  investments may lose value, and you may not recover your initial investment.
                </p>
                <p>
                  <strong>Not FDIC Insured:</strong> Investments through StacksEstate are not insured by the FDIC or any
                  other government agency.
                </p>
                <p>
                  <strong>Accredited Investors Only:</strong> Certain investment opportunities may only be available to
                  accredited investors as defined by securities regulations.
                </p>
                <p>
                  <strong>Tax Implications:</strong> Investments may have tax consequences. Please consult with a tax
                  professional regarding your specific situation.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about these risks or need additional information, please contact our support team
                at support@stacksestate.com or through our support center.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
