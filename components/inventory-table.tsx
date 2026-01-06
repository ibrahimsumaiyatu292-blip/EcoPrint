"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, AlertTriangle, Plus, Minus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface InventoryItem {
  id: number
  item_name: string
  category: string
  stock_quantity: number
  unit_price: string
  low_stock_threshold: number
  supplier: string
  last_restocked: string | null
}

export function InventoryTable({ inventory: initialInventory }: { inventory: InventoryItem[] }) {
  const router = useRouter()
  const [inventory, setInventory] = useState(initialInventory)
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = ["all", ...Array.from(new Set(inventory.map((item) => item.category)))]

  const filteredInventory = inventory.filter((item) => {
    if (categoryFilter === "all") return true
    return item.category === categoryFilter
  })

  const isLowStock = (item: InventoryItem) => {
    return item.stock_quantity <= item.low_stock_threshold
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return

    try {
      const response = await fetch(`/api/inventory/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setInventory(inventory.filter((item) => item.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting inventory item:", error)
    }
  }

  const handleStockAdjustment = async (id: number, adjustment: number) => {
    try {
      const response = await fetch(`/api/inventory/${id}/adjust`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adjustment }),
      })

      if (response.ok) {
        setInventory(
          inventory.map((item) =>
            item.id === id ? { ...item, stock_quantity: item.stock_quantity + adjustment } : item,
          ),
        )
        router.refresh()
      }
    } catch (error) {
      console.error("Error adjusting stock:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "All Categories" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Last Restocked</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No inventory items found
                </TableCell>
              </TableRow>
            ) : (
              filteredInventory.map((item) => (
                <TableRow key={item.id} className={isLowStock(item) ? "bg-orange-50" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isLowStock(item) && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                      <span className="font-medium">{item.item_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleStockAdjustment(item.id, -1)}
                        disabled={item.stock_quantity === 0}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className={`font-medium ${isLowStock(item) ? "text-orange-600" : ""}`}>
                        {item.stock_quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 bg-transparent"
                        onClick={() => handleStockAdjustment(item.id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    {isLowStock(item) && (
                      <p className="text-xs text-orange-600 mt-1">Low stock: threshold {item.low_stock_threshold}</p>
                    )}
                  </TableCell>
                  <TableCell>${Number(item.unit_price).toFixed(2)}</TableCell>
                  <TableCell>{item.supplier || "N/A"}</TableCell>
                  <TableCell>
                    {item.last_restocked ? new Date(item.last_restocked).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/inventory/${item.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
