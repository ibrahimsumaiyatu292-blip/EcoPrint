import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSql } from "@/lib/db"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CustomersTable } from "@/components/customers-table"

async function getCustomers() {
  const sql = getSql()
  if (!sql) {
    return []
  }

  const customers = await sql`
    SELECT 
      c.*,
      COUNT(o.id) as order_count,
      SUM(CASE WHEN o.status = 'completed' THEN o.total_amount ELSE 0 END) as total_spent
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id
    GROUP BY c.id
    ORDER BY c.created_at DESC
  `

  return customers
}

export default async function CustomersPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        <Button asChild>
          <Link href="/admin/customers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable customers={customers} />
        </CardContent>
      </Card>
    </div>
  )
}
