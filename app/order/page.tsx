import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { OrderForm } from "@/components/order-form"

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1 container mx-auto px-4 py-12">
        <OrderForm />
      </main>
      <SiteFooter />
    </div>
  )
}
