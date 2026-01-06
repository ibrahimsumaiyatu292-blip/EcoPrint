import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Target, Eye, Users, Leaf } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">About EcoPrints</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We're a professional digital printing company committed to delivering exceptional quality while
                maintaining sustainable practices. Since our founding, we've been helping businesses bring their visions
                to life through innovative printing solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardContent className="p-8">
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide businesses and individuals with high-quality, eco-friendly printing services that exceed
                    expectations. We strive to combine cutting-edge technology with sustainable practices, ensuring our
                    clients receive superior products while minimizing environmental impact.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <Eye className="h-12 w-12 text-primary mb-4" />
                  <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the leading sustainable printing company, recognized for innovation, quality, and
                    environmental responsibility. We envision a future where exceptional printing services and
                    ecological consciousness go hand in hand.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">The principles that guide everything we do</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Leaf className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Sustainability</h3>
                  <p className="text-sm text-muted-foreground">Eco-friendly materials and processes in every project</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Customer Focus</h3>
                  <p className="text-sm text-muted-foreground">Your satisfaction is our top priority</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Target className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Quality</h3>
                  <p className="text-sm text-muted-foreground">Uncompromising standards in every print</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Eye className="h-10 w-10 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Latest technology and creative solutions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  EcoPrints was founded with a simple yet powerful vision: to revolutionize the printing industry by
                  proving that exceptional quality and environmental responsibility can coexist. What started as a small
                  operation has grown into a trusted partner for businesses of all sizes.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Over the years, we've invested in state-of-the-art digital printing technology and sustainable
                  practices, allowing us to deliver stunning results while minimizing our ecological footprint. Our team
                  of skilled professionals brings decades of combined experience, ensuring every project receives the
                  attention and expertise it deserves.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today, we're proud to serve hundreds of satisfied customers, from startups to established
                  corporations, helping them make their mark with high-quality printed materials. As we continue to
                  grow, our commitment to quality, sustainability, and customer satisfaction remains unwavering.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
