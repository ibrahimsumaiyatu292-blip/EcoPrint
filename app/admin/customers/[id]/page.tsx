import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSql } from "@/lib/db"
import { ArrowLeft, Edit, Mail, Phone, Building } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getCustomerData(id: string) {
  const sql = getSql()
  if (!sql) return null

  const [customer, orders] = await Promise.all([
    sql`SELECT * FROM customers WHERE id = ${id}`,
    sql`
      SELECT * FROM orders 
      WHERE customer_id = ${id}
      ORDER BY order_date DESC
    `,
  ])

  if (customer.length === 0) {
    return null
  }

  return {
    customer: customer[0],
    orders,
  }
}

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await getCustomerData(id)

  if (!data) {
    notFound()
  }

  const { customer, orders } = data

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

  const totalSpent = orders
    .filter((order: any) => order.status === "completed")
    .reduce((sum: number, order: any) => sum + Number(order.total_amount), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/customers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{customer.name}</h1>
            <p className="text-muted-foreground">Customer details and order history</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/admin/customers/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Customer
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{customer.email}</p>
              </div>
            </div>

            {customer.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            )}

            {customer.company && (
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{customer.company}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-2xl font-bold text-primary">GH₵{totalSpent.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Average Order Value</p>
              <p className="text-2xl font-bold">
                GH₵{orders.length > 0 ? (totalSpent / orders.length).toFixed(2) : "0.00"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-bold">{orders.filter((o: any) => o.status === "pending").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <span className="font-bold">{orders.filter((o: any) => o.status === "in-progress").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold">{orders.filter((o: any) => o.status === "completed").length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Cancelled</span>
              <span className="font-bold">{orders.filter((o: any) => o.status === "cancelled").length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                        {order.order_number}
                      </Link>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.service_type} • {order.quantity} units • {new Date(order.order_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">GH₵{Number(order.total_amount).toFixed(2)}</div>
                    {order.due_date && (
                      <div className="text-xs text-muted-foreground">
                        Due: {new Date(order.due_date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
