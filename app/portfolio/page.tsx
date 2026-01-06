import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PortfolioPage() {
  const portfolioItems = [
    {
      title: "Corporate Business Cards",
      category: "Business Cards",
      description: "Premium matte finish business cards for a law firm",
      image: "/professional-business-cards-on-desk.jpg",
    },
    {
      title: "Event Flyers",
      category: "Flyers",
      description: "Vibrant flyers for a music festival",
      image: "/colorful-event-flyer-design.jpg",
    },
    {
      title: "Retail Banners",
      category: "Banners",
      description: "Large format banners for store opening",
      image: "/retail-store-banner-advertising.jpg",
    },
    {
      title: "Restaurant Menus",
      category: "Brochures",
      description: "Elegant tri-fold menus with specialty finishes",
      image: "/elegant-restaurant-menu.png",
    },
    {
      title: "Product Packaging",
      category: "Packaging",
      description: "Custom printed boxes for artisan products",
      image: "/custom-product-packaging-boxes.jpg",
    },
    {
      title: "Trade Show Posters",
      category: "Posters",
      description: "High-impact posters for conference exhibition",
      image: "/trade-show-poster-display.jpg",
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
              <h1 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">Our Portfolio</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Explore our recent projects and see the quality and creativity we bring to every printing job. From
                small business cards to large format banners, we're proud of every piece we produce.
              </p>
            </div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {portfolioItems.map((item, index) => (
                <div key={index} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-4 aspect-[3/2]">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-primary font-medium">{item.category}</div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Let's Create Something Amazing</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Ready to bring your vision to life? Contact us to discuss your next project and see how we can help you
              make a lasting impression.
            </p>
            <Button asChild size="lg">
              <Link href="/contact">Start Your Project</Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
