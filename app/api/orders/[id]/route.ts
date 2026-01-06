import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

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
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order[0])
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
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

    // If only updating status
    if (body.status && Object.keys(body).length === 1) {
      await sql`
        UPDATE orders 
        SET status = ${body.status}, updated_at = NOW()
        WHERE id = ${id}
      `
      return NextResponse.json({ success: true })
    }

    // Full update
    const {
      customer_id,
      service_type,
      quantity,
      paper_type,
      size,
      color_option,
      finishing,
      turnaround,
      status,
      total_amount,
      notes,
      due_date,
    } = body

    await sql`
      UPDATE orders 
      SET 
        customer_id = ${customer_id},
        service_type = ${service_type},
        quantity = ${quantity},
        paper_type = ${paper_type || null},
        size = ${size || null},
        color_option = ${color_option || null},
        finishing = ${finishing || null},
        turnaround = ${turnaround || null},
        status = ${status},
        total_amount = ${total_amount},
        notes = ${notes || null},
        due_date = ${due_date || null},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    await sql`DELETE FROM orders WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
