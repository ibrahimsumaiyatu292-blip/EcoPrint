import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    const item = await sql`SELECT * FROM inventory WHERE id = ${id}`

    if (item.length === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item[0])
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    const { item_name, category, stock_quantity, unit_price, low_stock_threshold, supplier } = body

    await sql`
      UPDATE inventory 
      SET 
        item_name = ${item_name},
        category = ${category},
        stock_quantity = ${stock_quantity},
        unit_price = ${unit_price},
        low_stock_threshold = ${low_stock_threshold},
        supplier = ${supplier || null},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    await sql`DELETE FROM inventory WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
