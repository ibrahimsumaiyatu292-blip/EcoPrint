import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"
import { uploadFile } from "@/lib/storage"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    if (!body.service_type) {
      return NextResponse.json({ error: "service_type is required" }, { status: 400 })
    }

    if (!body.email && !body.name && !body.phone) {
      return NextResponse.json({ error: "Provide at least one of: email, name, or phone" }, { status: 400 })
    }

    if (body.quantity && Number(body.quantity) < 1) {
      return NextResponse.json({ error: "quantity must be >= 1" }, { status: 400 })
    }

    const sql = getSql()
    if (!sql) {
      return NextResponse.json({ error: "No database connection configured" }, { status: 503 })
    }

    // Find or create customer (robust against missing email or DB constraints)
    let customerId: number | null = null
    if (body.email) {
      const existing = await sql`SELECT id FROM customers WHERE email = ${body.email}`
      if (existing && existing.length > 0) {
        customerId = existing[0].id
      } else {
        try {
          const created = await sql`
            INSERT INTO customers (name, email, phone, created_at, updated_at)
            VALUES (${body.name || null}, ${body.email || null}, ${body.phone || null}, NOW(), NOW())
            RETURNING id
          `
          customerId = created[0].id
        } catch (createErr) {
          console.error("Failed to create customer with email:", createErr)
          // Fall back to null customerId; order can still be created without customer link
          customerId = null
        }
      }
    } else if (body.name || body.phone) {
      try {
        const created = await sql`
          INSERT INTO customers (name, phone, created_at, updated_at)
          VALUES (${body.name || null}, ${body.phone || null}, NOW(), NOW())
          RETURNING id
        `
        customerId = created[0].id
      } catch (createErr) {
        console.error("Failed to create customer (no email):", createErr)
        customerId = null
      }
    }

    // Save uploaded file (base64 encoded) if provided
    let fileUrl: string | null = null
    let savedFileName: string | null = null
    let savedFileSize: number | null = null
    let savedFileMime: string | null = null
    if (body.file_data && body.file_name) {
      try {
        const buffer = Buffer.from(body.file_data, "base64")
        const safeName = body.file_name.replace(/[^a-zA-Z0-9._-]/g, "_")
        const filename = `${Date.now()}_${safeName}`

        const url = await uploadFile(buffer, filename)

        fileUrl = url
        savedFileName = body.file_name
        savedFileSize = buffer.length
        savedFileMime = body.file_mime || null
      } catch (fileErr) {
        console.error("Error saving uploaded file:", fileErr)
        // Non-blocking error for now, or we can choose to fail. 
        // Let's log but proceed, or maybe return error? 
        // Plan says replace, so let's stick to simple logic.
      }
    }

    const orderNumber = `ORD-${Date.now()}`

    const inserted = await sql`
      INSERT INTO orders (
        customer_id,
        order_number,
        service_type,
        quantity,
        status,
        total_amount,
        notes,
        file_url,
        file_name,
        file_size,
        file_mime,
        delivery_address,
        due_date,
        payment_method,
        payment_status,
        payment_reference,
        created_at,
        updated_at
      ) VALUES (

        ${customerId},
        ${orderNumber},
        ${body.service_type},
        ${body.quantity || 1},
        'pending',
        ${body.total_amount || 0},
        ${body.notes || null},
        ${fileUrl},
        ${savedFileName},
        ${savedFileSize},
        ${savedFileMime},
        ${body.delivery_address || null},
        ${body.due_date || null},
        ${body.payment_method || 'pay_on_delivery'},
        ${body.payment_status || 'pending'},
        ${body.payment_reference || null},
        NOW(),
        NOW()
      ) RETURNING id, order_number
    `

    return NextResponse.json({ success: true, order: inserted[0] })
  } catch (error: any) {
    console.error("Error creating order:", error)
    const isDev = process.env.NODE_ENV !== "production"
    if (isDev) {
      return NextResponse.json({ error: "Failed to create order", detail: error?.message || String(error), stack: error?.stack }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
