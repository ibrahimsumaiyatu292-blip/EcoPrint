import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileText, Printer, ImageIcon, Package, Award, Mail, Calendar, Shirt } from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      icon: FileText,
      title: "Business Cards",
      description: "Make a lasting first impression with professionally printed business cards",
      features: [
        "Standard and custom sizes",
        "Various finishes (matte, glossy, soft-touch)",
        "Single or double-sided printing",
        "Premium card stock options",
        "Specialty shapes and die-cuts",
      ],
    },
    {
      icon: Printer,
      title: "Flyers & Brochures",
      description: "Promote your business with vibrant marketing materials",
      features: [
        "Multiple sizes available",
        "Bi-fold, tri-fold, and custom folds",
        "Full-color printing",
        "Various paper weights",
        "Bulk discounts available",
      ],
    },
    {
      icon: ImageIcon,
      title: "Banners & Posters",
      description: "Large format printing for maximum visibility",
      features: [
        "Custom sizes up to 10ft wide",
        "Indoor and outdoor materials",
        "Vinyl, fabric, and paper options",
        "Grommets and finishing options",
        "Weather-resistant printing",
      ],
    },
    {
      icon: Package,
      title: "Packaging & Labels",
      description: "Custom packaging solutions for your products",
      features: [
        "Product labels and stickers",
        "Custom box printing",
        "Food-safe materials",
        "Die-cut shapes",
        "Variable data printing",
      ],
    },
    {
      icon: Award,
      title: "Certificates & Invitations",
      description: "Special occasion printing with elegant finishes",
      features: [
        "Premium paper stocks",
        "Foil stamping available",
        "Embossing and debossing",
        "Custom designs",
        "Matching envelopes",
      ],
    },
    {
      icon: Mail,
      title: "Direct Mail",
      description: "Complete direct mail campaign services",
      features: [
        "Postcards and mailers",
        "Mailing list services",
        "Design assistance",
        "Bulk mailing discounts",
        "Tracking and reporting",
      ],
    },
    {
      icon: Calendar,
      title: "Calendars & Planners",
      description: "Custom calendars and organizational tools",
      features: [
        "Wall and desk calendars",
        "Custom date ranges",
        "Spiral or stapled binding",
        "Full-color printing",
        "Personalization options",
      ],
    },
    {
      icon: Shirt,
      title: "Promotional Products",
      description: "Branded merchandise for marketing and events",
      features: [
        "T-shirts and apparel",
        "Mugs and drinkware",
        "Pens and office supplies",
        "Tote bags and accessories",
        "Custom product sourcing",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">Our Services</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Comprehensive digital printing solutions for all your business needs. From business cards to large
                format banners, we deliver exceptional quality and fast turnaround times.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const Icon = service.icon
                return (
                  <Card key={index} className="flex flex-col">
                    <CardHeader>
                      <Icon className="h-12 w-12 text-primary mb-3" />
                      <CardTitle>{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Don't see what you're looking for? We offer custom printing solutions tailored to your specific needs.
              Contact us to discuss your project.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
