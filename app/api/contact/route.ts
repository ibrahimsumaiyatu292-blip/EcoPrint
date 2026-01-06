import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Insert into database
    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    await sql`
      INSERT INTO contact_messages (name, email, phone, subject, message, status)
      VALUES (${name}, ${email}, ${phone || null}, ${subject || null}, ${message}, 'new')
    `

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Error saving contact message:", error)
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 })
  }
}
