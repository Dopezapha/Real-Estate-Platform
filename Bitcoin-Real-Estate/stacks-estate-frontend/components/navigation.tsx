"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/wallet-connect-button"
import { Menu, X, Building2 } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected } = useWallet()
  const pathname = usePathname()

  const isLandingPage = pathname === "/"

  const navItems = [
    { href: "/properties", label: "Properties", requiresAuth: true },
    { href: "/dashboard", label: "Dashboard", requiresAuth: true },
    { href: "/portfolio", label: "Portfolio", requiresAuth: true },
    { href: "/transactions", label: "Transactions", requiresAuth: true },
  ]

  const visibleNavItems = navItems.filter((item) => {
    if (item.requiresAuth && !isConnected) return false
    return true
  })

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">StacksEstate</span>
          </Link>

          {/* Desktop Navigation - Hide nav items on landing page when not connected */}
          <div className="hidden md:flex items-center space-x-8">
            {!isLandingPage &&
              visibleNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isLandingPage && !isConnected && (
              <Button asChild variant="outline" className="hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-200">
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            )}
            <WalletConnectButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="hover:bg-accent/20 hover:text-accent transition-all duration-200">
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 glass-card mt-2 rounded-lg">
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
              {isLandingPage && !isConnected && (
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 text-primary hover:text-accent transition-colors duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
              )}
              {!isLandingPage &&
                visibleNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-3 py-2 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              <div className="px-3 py-2">
                <WalletConnectButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
