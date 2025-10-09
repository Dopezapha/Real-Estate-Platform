import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, Mail } from "lucide-react"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is StacksEstate?",
      answer:
        "StacksEstate is a Bitcoin-backed real estate investment platform that allows you to invest in premium properties using sBTC. We enable fractional ownership of real estate through blockchain technology.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply connect your Stacks wallet, browse our available properties, and invest using sBTC. You can start with as little as $100 worth of Bitcoin.",
    },
    {
      question: "What is sBTC?",
      answer:
        "sBTC is a Bitcoin-backed token on the Stacks blockchain that maintains a 1:1 peg with Bitcoin. It allows you to use Bitcoin in smart contracts and DeFi applications.",
    },
    {
      question: "How do I earn rental income?",
      answer:
        "Rental income is distributed monthly to token holders proportional to their ownership stake. Payments are made directly to your wallet in sBTC.",
    },
    {
      question: "What are the fees?",
      answer:
        "We charge a 2% annual management fee and a 10% performance fee on rental income. There are no hidden fees or charges.",
    },
    {
      question: "Can I sell my property tokens?",
      answer:
        "Yes, property tokens can be traded on our secondary market or through compatible DEXs. Liquidity may vary by property.",
    },
    {
      question: "What happens if a property is sold?",
      answer:
        "When a property is sold, proceeds are distributed to token holders proportional to their ownership stake, minus applicable fees.",
    },
    {
      question: "How are properties selected?",
      answer:
        "Our team conducts thorough due diligence on all properties, including location analysis, cash flow projections, and market conditions.",
    },
    {
      question: "Is my investment insured?",
      answer:
        "Properties are insured against damage and liability. However, investment returns are not guaranteed and subject to market risks.",
    },
    {
      question: "What wallets are supported?",
      answer: "We support all Stacks-compatible wallets including Hiro Wallet, Xverse, and Leather Wallet.",
    },
  ]

  const categories = [
    {
      title: "Getting Started",
      description: "Basic questions about using the platform",
      count: 4,
    },
    {
      title: "Investments",
      description: "Questions about investing and returns",
      count: 3,
    },
    {
      title: "Technical",
      description: "Wallet and blockchain related questions",
      count: 2,
    },
    {
      title: "Legal & Compliance",
      description: "Regulatory and legal information",
      count: 1,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
              Find answers to common questions about StacksEstate and Bitcoin-backed real estate investing.
            </p>
          </div>
        </section>

        {/* Categories */}
        <section className="py-10 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {categories.map((category, index) => (
                <Card key={index} className="text-center cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{category.count}</div>
                    <div className="text-sm text-muted-foreground">Questions</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-2">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline">
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </Button>
              <Button size="lg">
                <Mail className="mr-2 h-5 w-5" />
                Contact Support
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
