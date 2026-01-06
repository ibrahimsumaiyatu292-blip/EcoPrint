import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSql } from "@/lib/db"
import { Plus } from "lucide-react"
import Link from "next/link"
import { InventoryTable } from "@/components/inventory-table"

async function getInventory() {
  const sql = getSql()
  if (!sql) {
    return []
  }

  const inventory = await sql`
    SELECT * FROM inventory
    ORDER BY 
      CASE WHEN stock_quantity <= low_stock_threshold THEN 0 ELSE 1 END,
      item_name ASC
  `

  return inventory
}

export default async function InventoryPage() {
  const inventory = await getInventory()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">Manage your stock and supplies</p>
        </div>
        <Button asChild>
          <Link href="/admin/inventory/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <InventoryTable inventory={inventory} />
        </CardContent>
      </Card>
    </div>
  )
}
