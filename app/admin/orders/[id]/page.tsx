import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSql } from "@/lib/db"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getOrder(id: string) {
  const sql = getSql()
  if (!sql) return null

  const order = await sql`
    SELECT 
      o.*,
      c.name as customer_name,
      c.email as customer_email,
      c.phone as customer_phone,
      c.company as customer_company
    FROM orders o
    LEFT JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ${id}
  `

  if (order.length === 0) {
    return null
  }

  return order[0]
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "in-progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "completed":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Order {order.order_number}</h1>
            <p className="text-muted-foreground">View order details and information</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/orders/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Order
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-medium">{order.order_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant="secondary" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Service Type</p>
                <p className="font-medium">{order.service_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paper Type</p>
                <p className="font-medium">{order.paper_type || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="font-medium">{order.size || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{order.color_option || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Finishing</p>
                <p className="font-medium">{order.finishing || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Turnaround</p>
                <p className="font-medium">{order.turnaround || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold text-primary">${Number(order.total_amount).toFixed(2)}</p>
              </div>
            </div>

            {order.notes && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Notes</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer & Dates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
              )}
              {order.customer_company && (
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{order.customer_company}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{new Date(order.order_date).toLocaleDateString()}</p>
              </div>
              {order.due_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(order.due_date).toLocaleDateString()}</p>
                </div>
              )}
              {order.completed_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed Date</p>
                  <p className="font-medium">{new Date(order.completed_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
