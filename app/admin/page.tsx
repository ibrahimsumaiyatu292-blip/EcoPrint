import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSql } from "@/lib/db"
import { ShoppingCart, Package, Users, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

async function getDashboardStats() {
  const sql = getSql()
  if (!sql) {
    return {
      orders: { total: 0, pending: 0, in_progress: 0, completed: 0 },
      inventory: { total: 0, total_items: 0, low_stock_items: 0 },
      customers: { total: 0 },
      revenue: { total_revenue: 0, monthly_revenue: 0 },
      lowStock: [],
    }
  }

  const [ordersData, inventoryData, customersData, revenueData, lowStockData] = await Promise.all([
    sql`SELECT COUNT(*) as total, 
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'in-progress' THEN 1 END) as in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
        FROM orders`,
    sql`SELECT COUNT(*) as total, 
        SUM(stock_quantity) as total_items,
        COUNT(CASE WHEN stock_quantity <= low_stock_threshold THEN 1 END) as low_stock_items
        FROM inventory`,
    sql`SELECT COUNT(*) as total FROM customers`,
    sql`SELECT 
        SUM(total_amount) as total_revenue,
        SUM(CASE WHEN order_date >= NOW() - INTERVAL '30 days' THEN total_amount ELSE 0 END) as monthly_revenue
        FROM orders WHERE status = 'completed'`,
    sql`SELECT item_name, stock_quantity, low_stock_threshold 
        FROM inventory 
        WHERE stock_quantity <= low_stock_threshold 
        ORDER BY stock_quantity ASC 
        LIMIT 5`,
  ])

  return {
    orders: ordersData[0],
    inventory: inventoryData[0],
    customers: customersData[0],
    revenue: revenueData[0],
    lowStock: lowStockData,
  }
}

export default async function AdminDashboard() {
  const user = await currentUser()
  if (!user) {
    redirect("/") // or let middleware handle it, but double check doesn't hurt
  }
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.orders.pending} pending, {stats.orders.in_progress} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Number(stats.revenue.total_revenue || 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${Number(stats.revenue.monthly_revenue || 0).toFixed(2)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inventory.total}</div>
            <p className="text-xs text-muted-foreground mt-1">{stats.inventory.total_items} total units in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Active customer accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStock.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <AlertTriangle className="h-5 w-5" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.lowStock.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-white p-3">
                  <span className="text-sm font-medium">{item.item_name}</span>
                  <span className="text-sm text-orange-700">
                    {item.stock_quantity} / {item.low_stock_threshold} units
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Order Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Pending Orders</span>
                <span className="text-2xl font-bold text-yellow-600">{stats.orders.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">In Progress</span>
                <span className="text-2xl font-bold text-blue-600">{stats.orders.in_progress}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Completed</span>
                <span className="text-2xl font-bold text-green-600">{stats.orders.completed}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Items</span>
                <span className="text-2xl font-bold">{stats.inventory.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Stock Units</span>
                <span className="text-2xl font-bold">{stats.inventory.total_items}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Low Stock Items</span>
                <span className="text-2xl font-bold text-orange-600">{stats.inventory.low_stock_items}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
