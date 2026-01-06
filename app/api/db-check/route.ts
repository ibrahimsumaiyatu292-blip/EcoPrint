import { type NextRequest, NextResponse } from "next/server"
import { getSql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const sql = getSql()
  if (!sql) {
    return NextResponse.json({ ok: false, error: "No DATABASE_URL configured" }, { status: 503 })
  }

  try {
    const res = await sql`SELECT 1 as ping`
    if (res && res.length > 0) {
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ ok: false, error: "Unexpected response" }, { status: 500 })
  } catch (err) {
    console.error("DB check failed:", err)
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
