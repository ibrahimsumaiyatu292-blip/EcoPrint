import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { adjustment } = body
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    // Update stock quantity
    await sql`
      UPDATE inventory 
      SET 
        stock_quantity = stock_quantity + ${adjustment},
        updated_at = NOW(),
        last_restocked = CASE WHEN ${adjustment} > 0 THEN NOW() ELSE last_restocked END
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adjusting inventory:", error)
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 })
  }
}
