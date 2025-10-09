"use client"

import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("dark")

  useEffect(() => {
    // Get initial theme from localStorage or default to dark
    const savedTheme = (localStorage.getItem("theme") as "light" | "dark" | "system") || "dark"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  const applyTheme = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.toggle("dark", systemTheme === "dark")
    } else {
      root.classList.toggle("dark", newTheme === "dark")
    }

    localStorage.setItem("theme", newTheme)
  }

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="glass-card bg-transparent hover:bg-accent/20 hover:text-accent hover:border-accent transition-all duration-200"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className="hover:bg-accent/20 hover:text-accent cursor-pointer transition-all duration-200"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className="hover:bg-accent/20 hover:text-accent cursor-pointer transition-all duration-200"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className="hover:bg-accent/20 hover:text-accent cursor-pointer transition-all duration-200"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
