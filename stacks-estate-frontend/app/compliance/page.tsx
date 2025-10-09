import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Shield, FileText, Users, Globe, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function CompliancePage() {
  const certifications = [
    {
      title: "SOC 2 Type II",
      description: "Security, availability, and confidentiality controls",
      status: "Certified",
    },
    {
      title: "ISO 27001",
      description: "Information security management system",
      status: "In Progress",
    },
    {
      title: "GDPR Compliant",
      description: "European data protection regulation compliance",
      status: "Certified",
    },
  ]

  const frameworks = [
    {
      icon: Shield,
      title: "Security Framework",
      description: "Multi-layered security approach with regular audits and penetration testing",
    },
    {
      icon: FileText,
      title: "Regulatory Compliance",
      description: "Adherence to securities laws and financial regulations in all operating jurisdictions",
    },
    {
      icon: Users,
      title: "KYC/AML Procedures",
      description: "Know Your Customer and Anti-Money Laundering compliance protocols",
    },
    {
      icon: Globe,
      title: "International Standards",
      description: "Compliance with international financial and data protection standards",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-6">Compliance & Security</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We maintain the highest standards of compliance and security to protect our users and their investments.
            </p>
          </div>

          {/* Compliance Frameworks */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Our Compliance Framework</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {frameworks.map((framework, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <framework.icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{framework.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{framework.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section className="mb-16 bg-muted/30 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-12">Certifications & Standards</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={cert.status === "Certified" ? "default" : "secondary"} className="text-sm">
                      {cert.status === "Certified" && <CheckCircle className="w-3 h-3 mr-1" />}
                      {cert.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Detailed Compliance Information */}
          <section className="space-y-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Regulatory Compliance</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Securities Compliance</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• SEC registration and compliance for applicable securities</li>
                    <li>• Regulation D exemptions for private placements</li>
                    <li>• Blue sky law compliance in all operating states</li>
                    <li>• Regular filing of required regulatory reports</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Financial Regulations</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Bank Secrecy Act (BSA) compliance</li>
                    <li>• FinCEN reporting requirements</li>
                    <li>• OFAC sanctions screening</li>
                    <li>• State money transmitter licenses where required</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Data Protection & Privacy</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Privacy Standards</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• GDPR compliance for European users</li>
                    <li>• CCPA compliance for California residents</li>
                    <li>• Data minimization and purpose limitation</li>
                    <li>• User consent management</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Security Measures</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• End-to-end encryption of sensitive data</li>
                    <li>• Multi-factor authentication requirements</li>
                    <li>• Regular security audits and penetration testing</li>
                    <li>• Incident response and breach notification procedures</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">Operational Controls</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Risk Management</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Comprehensive risk assessment framework</li>
                    <li>• Regular compliance monitoring and testing</li>
                    <li>• Third-party vendor due diligence</li>
                    <li>• Business continuity and disaster recovery plans</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">Governance</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Board oversight of compliance programs</li>
                    <li>• Regular compliance training for all staff</li>
                    <li>• Clear policies and procedures documentation</li>
                    <li>• Independent compliance officer reporting</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="mt-16 text-center bg-muted/30 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Compliance Questions?</h2>
            <p className="text-muted-foreground mb-6">
              Our compliance team is available to answer any questions about our regulatory adherence and security
              practices.
            </p>
            <p className="text-sm text-muted-foreground">Contact: compliance@stacksestate.com</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
