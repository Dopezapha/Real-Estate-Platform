import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-4xl mx-auto px-4 py-20">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <div className="text-muted-foreground mb-8">Last updated: September 28, 2025</div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing and using StacksEstate, you accept and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="mb-4">
                StacksEstate provides a platform for Bitcoin-backed real estate investment through blockchain
                technology. Our services include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fractional real estate investment opportunities</li>
                <li>Property token trading and management</li>
                <li>Rental income distribution</li>
                <li>Portfolio tracking and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Responsibilities</h2>
              <p className="mb-4">As a user of our platform, you agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your wallet and account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not engage in fraudulent or illegal activities</li>
                <li>Understand the risks associated with cryptocurrency investments</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Investment Risks</h2>
              <p className="mb-4">
                Real estate and cryptocurrency investments carry inherent risks, including but not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Market volatility and potential loss of principal</li>
                <li>Liquidity constraints</li>
                <li>Regulatory changes</li>
                <li>Technology risks</li>
                <li>Property-specific risks</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Fees and Charges</h2>
              <p>
                Our fee structure includes a 2% annual management fee and a 10% performance fee on rental income.
                Additional fees may apply for specific services. All fees are clearly disclosed before any transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
              <p>
                StacksEstate shall not be liable for any indirect, incidental, special, consequential, or punitive
                damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Termination</h2>
              <p>
                We may terminate or suspend your account and access to our services at our sole discretion, without
                prior notice, for conduct that we believe violates these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at legal@stacksestate.com or through our
                support center.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
