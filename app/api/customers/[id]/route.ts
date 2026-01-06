import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    const customer = await sql`SELECT * FROM customers WHERE id = ${id}`

    if (customer.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer[0])
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
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

    const { name, email, phone, company } = body

    await sql`
      UPDATE customers 
      SET 
        name = ${name},
        email = ${email},
        phone = ${phone || null},
        company = ${company || null},
        updated_at = NOW()
      WHERE id = ${id}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    await sql`DELETE FROM customers WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
