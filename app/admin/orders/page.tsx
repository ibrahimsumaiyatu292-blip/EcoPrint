import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSql } from "@/lib/db"
import { Plus } from "lucide-react"
import Link from "next/link"
import { OrdersTable } from "@/components/orders-table"

async function getOrders() {
  const sql = getSql()
  if (!sql) {
    return []
  }

  const orders = await sql`
    SELECT 
      o.*,
      c.name as customer_name,
      c.email as customer_email
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    ORDER BY o.order_date DESC
  `

  return orders
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage and track all customer orders</p>
        </div>
        <Button asChild>
          <Link href="/admin/orders/new">
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}
