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
      title: "Document Services",
      description: "Professional typing and document processing",
      features: [
        "Typing: GH₵7.00",
        "Printing (Front): GH₵4.00",
        "Photocopy (B&W Front): GH₵0.70",
        "Photocopy (B&W Front/Back): GH₵1.00",
        "Photocopy (Colored Front): GH₵2.00",
        "Photocopy (Colored Front/Back): GH₵3.00",
      ],
    },
    {
      icon: Award,
      title: "Lamination & Binding",
      description: "Protect and organize your important documents",
      features: [
        "Lamination (A4): GH₵7.00",
        "Binding: GH₵7.00",
        "Professional Finish",
        "Durable Materials",
        "Quick Turnaround",
      ],
    },
    {
      icon: ImageIcon,
      title: "Passport Pictures",
      description: "Instant high-quality passport photos",
      features: [
        "4 Pictures: GH₵20.00",
        "2 Pictures: GH₵15.00",
        "Standard Sizes",
        "Instant Service",
        "Professional Lighting",
      ],
    },
    {
      icon: Package,
      title: "Design Services",
      description: "Custom graphic design for your needs",
      features: [
        "Professional Design: GH₵40.00",
        "Flyers & Banners",
        "Brochures",
        "Business Cards",
        "Custom Layouts",
      ],
    },
    {
      icon: Mail,
      title: "Envelopes & Packaging",
      description: "Custom envelopes and packaging solutions",
      features: [
        "Envelopes: GH₵20.00",
        "Custom Branding",
        "Various Sizes",
        "Professional Look",
        "Bulk Options",
      ],
    },
    {
      icon: Printer,
      title: "Marketing Materials",
      description: "Promote your business effectively",
      features: [
        "Brochures (Price varies by size)",
        "Flyers (Price varies by size)",
        "Banners (Price varies by size)",
        "High Quality Printing",
        "Vibrant Colors",
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
