"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminEditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const resolvedParams = await params;
      setOrderId(resolvedParams.id);
    })();
  }, [params]);

  const [form, setForm] = useState({
    service_type: "",
    quantity: 1,
    notes: "",
    delivery_address: "",
    due_date: "",
    total_amount: 0,
    status: "",
    payment_status: "",
    payment_method: "",
    file_url: "",
    file_name: "",
    file_size: 0,
    file_mime: ""
  })

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (!res.ok) {
          const errBody = await res.text()
          throw new Error(`Failed to load order: ${res.status} ${errBody}`)
        }
        const data = await res.json()

        setForm({
          service_type: data.service_type || "",
          quantity: data.quantity || 1,
          notes: data.notes || "",
          delivery_address: data.delivery_address || "",
          due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "",
          total_amount: Number(data.total_amount) || 0,
          status: data.status || "pending",
          payment_status: data.payment_status || "pending",
          payment_method: data.payment_method || "pay_on_delivery",
          file_url: data.file_url,
          file_name: data.file_name,
          file_size: data.file_size,
          file_mime: data.file_mime
        })
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === "quantity" || name === "total_amount" ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error("Failed to update order")

      router.push(`/admin/orders/${orderId}`)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>
  if (error) return <div className="text-red-500 p-10">{error}</div>

  return (
    <div className="container mx-auto py-10 px-4 max-w-2xl">
      <Button variant="ghost" asChild className="mb-6 pl-0">
        <Link href={`/admin/orders/${orderId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Details</Link>
      </Button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Order #{orderId} (Admin)</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <select id="status" name="status" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <Label htmlFor="payment_status">Payment Status</Label>
              <select id="payment_status" name="payment_status" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.payment_status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="service_type">Service Type</Label>
            <select id="service_type" name="service_type" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.service_type} onChange={handleChange} required>
              <option value="">Select a service</option>
              <option value="secretarial">Secretarial Services</option>
              <option value="funeral">Funeral Brochures</option>
              <option value="magazine">Magazines & Letterheads</option>
              <option value="receipt">Receipt & Invoice Books</option>
              <option value="poster">Posters & Obituaries</option>
              <option value="exam">WAEC/BECE Card Services</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="total_amount">Total Amount (GH₵)</Label>
              <Input id="total_amount" name="total_amount" type="number" step="0.01" value={form.total_amount} onChange={handleChange} />
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="delivery_address">Delivery Address</Label>
              <Input id="delivery_address" name="delivery_address" value={form.delivery_address} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="due_date">Due/Delivery Date</Label>
              <Input id="due_date" name="due_date" type="date" value={form.due_date} onChange={handleChange} />
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link href={`/admin/orders/${orderId}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
