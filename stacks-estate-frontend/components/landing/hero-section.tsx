"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Bitcoin, TrendingUp, Shield } from "lucide-react"
import { motion } from "framer-motion"
import { useWallet } from "@/lib/wallet-context"
import Link from "next/link"

export function HeroSection() {
  const { isConnected, connectWallet } = useWallet()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Announcement Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center px-4 py-2 rounded-full glass-card mb-8"
        >
          <div className="w-2 h-2 bg-accent rounded-full mr-2 animate-pulse" />
          <span className="text-sm text-muted-foreground">Announcing $20M in Seed & Series A Funding</span>
          <ArrowRight className="h-4 w-4 ml-2 text-muted-foreground" />
        </motion.div>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">
            <span className="text-foreground">Bitcoin-Backed</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Real Estate Investment
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            Invest in premium real estate with sBTC through Stacks blockchain. Earn monthly rental income with
            institutional-grade security and transparency.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          {isConnected ? (
            <Link href="/properties">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                Browse Properties
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              onClick={connectWallet}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            >
              Connect Wallet
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          )}

          <Button 
            size="lg" 
            variant="outline" 
            className="glass-card px-8 py-4 text-lg bg-transparent hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-200" 
            asChild
          >
            <Link href="/how-it-works">Learn More</Link>
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
        >
          <div className="glass-card p-6 rounded-xl hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer">
            <Bitcoin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Bitcoin Native</h3>
            <p className="text-muted-foreground">
              Invest with sBTC on Stacks blockchain for true Bitcoin-backed real estate ownership
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Monthly Returns</h3>
            <p className="text-muted-foreground">
              Earn consistent rental income distributed monthly to your wallet automatically
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl hover:bg-accent/10 hover:border-accent/50 transition-all duration-200 cursor-pointer">
            <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Institutional Grade</h3>
            <p className="text-muted-foreground">
              Smart contract security with professional property management and verification
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
