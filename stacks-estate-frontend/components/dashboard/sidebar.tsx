"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Building2, 
  LayoutDashboard, 
  Home, 
  Briefcase, 
  CreditCard, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/properties", icon: Home },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Transactions", href: "/transactions", icon: CreditCard },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { address, disconnectWallet } = useWallet()

  const profileName = "Anonymous"
  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Unknown"

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setIsMobileOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }, [pathname, isMobile])

  const handleDisconnect = () => {
    disconnectWallet()
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }

  const toggleDesktopSidebar = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsMobileOpen(!isMobileOpen)} 
          className="glass-card shadow-lg"
        >
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Desktop Collapse Toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDesktopSidebar}
        className={cn(
          "hidden lg:flex fixed top-4 z-50 glass-card shadow-lg transition-all duration-300",
          isDesktopCollapsed ? "left-20" : "left-[272px]"
        )}
      >
        {isDesktopCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background/95 backdrop-blur-sm border-r border-border transition-all duration-300 ease-in-out",
          // Mobile behavior
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop width
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile always full width when open
          "w-64"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className={cn(
            "flex items-center border-b border-border transition-all duration-300",
            isDesktopCollapsed ? "lg:justify-center lg:p-4" : "justify-between p-6"
          )}>
            <div className={cn(
              "flex items-center space-x-2",
              isDesktopCollapsed && "lg:flex-col lg:space-x-0 lg:space-y-1"
            )}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              {(!isDesktopCollapsed || isMobile) && (
                <span className="text-xl font-bold whitespace-nowrap">StacksEstate</span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMobileOpen(false)} 
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User Profile */}
          <div className={cn(
            "border-b border-border transition-all duration-300",
            isDesktopCollapsed ? "lg:p-4" : "p-6"
          )}>
            <div className={cn(
              "flex items-center",
              isDesktopCollapsed ? "lg:flex-col lg:space-x-0" : "space-x-3"
            )}>
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>{profileName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              {(!isDesktopCollapsed || isMobile) && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{profileName}</p>
                  <p className="text-xs text-muted-foreground truncate">{displayAddress}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => isMobile && setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-colors",
                    isDesktopCollapsed 
                      ? "lg:justify-center lg:p-3" 
                      : "space-x-3 px-3 py-2",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  title={isDesktopCollapsed ? item.name : undefined}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {(!isDesktopCollapsed || isMobile) && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-2">
            <Link
              href="/settings"
              onClick={() => isMobile && setIsMobileOpen(false)}
              className={cn(
                "flex items-center rounded-lg text-sm font-medium transition-colors",
                isDesktopCollapsed 
                  ? "lg:justify-center lg:p-3" 
                  : "space-x-3 px-3 py-2",
                pathname === "/settings"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              title={isDesktopCollapsed ? "Settings" : undefined}
            >
              <Settings className="h-4 w-4 flex-shrink-0" />
              {(!isDesktopCollapsed || isMobile) && <span>Settings</span>}
            </Link>
            <Button
              variant="ghost"
              onClick={handleDisconnect}
              className={cn(
                "w-full text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors",
                isDesktopCollapsed 
                  ? "lg:justify-center lg:p-3" 
                  : "justify-start"
              )}
              title={isDesktopCollapsed ? "Sign Out" : undefined}
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              {(!isDesktopCollapsed || isMobile) && <span className="ml-3">Sign Out</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
          onTouchStart={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Content Spacer */}
      <div 
        className={cn(
          "hidden lg:block transition-all duration-300",
          isDesktopCollapsed ? "lg:w-20" : "lg:w-64"
        )} 
      />
    </>
  )
}
