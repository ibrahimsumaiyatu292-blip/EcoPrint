import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Leaf, Clock, Award, Printer, FileText, ImageIcon, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/5 via-secondary to-accent/5 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-balance md:text-5xl lg:text-6xl mb-6">
                  Professional Printing, <span className="text-primary">Eco-Friendly</span> Solutions
                </h1>
                <p className="text-lg text-muted-foreground text-pretty mb-8">
                  From business cards to banners, we deliver high-quality digital printing services with sustainable
                  practices. Fast turnaround, competitive pricing, and exceptional results.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link href="/contact">Get a Free Quote</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/services">View Services</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/modern-printing-press-with-eco-friendly-materials.jpg"
                  alt="Professional printing equipment"
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose EcoPrints?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We combine cutting-edge technology with sustainable practices to deliver exceptional printing services
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Leaf className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Eco-Friendly</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Sustainable materials and processes that minimize environmental impact
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Fast Turnaround</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Quick delivery without compromising on quality. Rush orders available
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Premium Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    State-of-the-art equipment ensuring vibrant colors and sharp details
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Sparkles className="h-10 w-10 text-primary mb-2" />
                  <CardTitle>Custom Solutions</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Tailored printing solutions to meet your unique business needs</CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive printing solutions for all your business needs
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <FileText className="h-12 w-12 text-primary mb-3" />
                  <CardTitle>Business Cards</CardTitle>
                  <CardDescription>Professional business cards that make a lasting impression</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Multiple finishes available
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Single or double-sided
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Premium card stock
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Printer className="h-12 w-12 text-primary mb-3" />
                  <CardTitle>Flyers & Brochures</CardTitle>
                  <CardDescription>Eye-catching marketing materials to promote your business</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Various sizes and folds
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Full-color printing
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Bulk discounts
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ImageIcon className="h-12 w-12 text-primary mb-3" />
                  <CardTitle>Banners & Posters</CardTitle>
                  <CardDescription>Large format printing for events, retail, and promotions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Indoor & outdoor materials
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Custom sizes
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Weather-resistant options
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg">
                <Link href="/services">View All Services</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                <p className="text-lg mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
                  Contact us today for a free quote and discover how we can help bring your printing projects to life
                </p>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/contact">Contact Us Today</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
