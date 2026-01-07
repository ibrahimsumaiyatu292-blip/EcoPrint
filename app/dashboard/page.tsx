import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getSql } from "@/lib/db"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, FileText, User, ShoppingBag } from "lucide-react"

async function getUserOrders(email: string) {
    const sql = getSql()
    if (!sql) return []

    // Ensure customer exists or find by email
    // Ideally, orders are linked by customer_id, but here validation is simpler by email match
    // logic reused from admin check but clearer

    // We need to fetch orders where the linked customer has this email
    const orders = await sql`
    SELECT 
      o.*
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE c.email = ${email}
    ORDER BY o.created_at DESC
  `
    return orders
}

export default async function DashboardPage() {
    const user = await currentUser()
    if (!user || !user.emailAddresses[0]) {
        redirect("/")
    }

    const email = user.emailAddresses[0].emailAddress
    const orders = await getUserOrders(email)

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">My Account</h1>
                    <p className="text-muted-foreground">Welcome back, {user.firstName || "Customer"}</p>
                </div>
                <Button asChild>
                    <Link href="/order">Place New Order</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Order History</h2>
                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-lg font-medium">No orders yet</p>
                            <p className="text-muted-foreground mb-4">Start by placing your first print order.</p>
                            <Button asChild variant="outline">
                                <Link href="/order">Order Now</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order: any) => (
                            <Card key={order.id} className="overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-bold text-lg">{order.service_type}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize 
                                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Order #{order.order_number} • {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl">GH₵{Number(order.total_amount).toFixed(2)}</div>
                                            <div className="text-sm text-muted-foreground">{order.payment_method === 'paystack' ? 'Online Payment' : 'Pay on Delivery'}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                                        {/* Edit Button */}
                                        {order.status === 'pending' && (
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/dashboard/orders/${order.id}`}>Edit Order</Link>
                                            </Button>
                                        )}
                                        {/* View Receipt - Placeholder linked to Edit for now as 'Details' */}
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/orders/${order.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
