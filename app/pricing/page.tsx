import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
  const pricingData = [
    {
      service: "Business Cards",
      tiers: [
        { quantity: 250, price: 75 },
        { quantity: 500, price: 125 },
        { quantity: 1000, price: 200 },
      ],
      note: "Standard size, full-color, both sides",
    },
    {
      service: "Flyers",
      tiers: [
        { quantity: 100, price: 50 },
        { quantity: 500, price: 180 },
        { quantity: 1000, price: 300 },
      ],
      note: "A4 size, full-color, single-sided",
    },
    {
      service: "Brochures",
      tiers: [
        { quantity: 100, price: 120 },
        { quantity: 250, price: 250 },
        { quantity: 500, price: 450 },
      ],
      note: "Tri-fold, full-color",
    },
    {
      service: "Posters",
      tiers: [
        { quantity: 10, price: 80 },
        { quantity: 25, price: 175 },
        { quantity: 50, price: 300 },
      ],
      note: "A3 size, full-color",
    },
    {
      service: "Banners",
      tiers: [
        { size: "3ft x 6ft", price: 85 },
        { size: "4ft x 8ft", price: 150 },
        { size: "6ft x 10ft", price: 280 },
      ],
      note: "Vinyl, full-color, grommets included",
    },
  ]

  const features = [
    "Free design consultation",
    "Fast turnaround times",
    "Rush orders available",
    "Bulk discounts",
    "High-quality materials",
    "Eco-friendly options",
    "Color accuracy guarantee",
    "Free shipping on orders over GH₵200",
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">Transparent Pricing</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Competitive rates with no hidden fees. Get professional quality printing at affordable prices with bulk
                discounts available.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Tables */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="space-y-8">
              {pricingData.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{item.service}</CardTitle>
                    <CardDescription>{item.note}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {item.tiers.map((tier, idx) => (
                        <div key={idx} className="flex flex-col items-center p-4 border border-border rounded-lg">
                          <div className="text-sm text-muted-foreground mb-2">
                            {tier.quantity ? `${tier.quantity} units` : tier.size}
                          </div>
                          <div className="text-3xl font-bold text-primary mb-2">GH₵{tier.price}</div>
                          <div className="text-xs text-muted-foreground">
                            {tier.quantity && `GH₵${(tier.price / tier.quantity).toFixed(2)} per unit`}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                Prices shown are starting rates for standard specifications. Custom sizes, materials, and finishes may
                affect pricing. Contact us for a detailed quote.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What's Included</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every order comes with our quality guarantee and exceptional service
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Contact us today for a detailed quote tailored to your specific project requirements
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Request a Quote</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">View Services</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
