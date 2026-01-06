"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <span className="text-xl font-bold text-primary-foreground">EP</span>
          </div>
          <span className="text-xl font-bold text-primary">EcoPrints</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/services"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Services
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/order"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Order
          </Link>
          <Link
            href="/portfolio"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Portfolio
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/customer">Customer Portal</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/contact">Get Quote</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-6">
            <Link href="/" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/services" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="/pricing" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/order" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Order
            </Link>
            <Link href="/portfolio" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Portfolio
            </Link>
            <Link href="/contact" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/customer">Customer Portal</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/contact">Get Quote</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
