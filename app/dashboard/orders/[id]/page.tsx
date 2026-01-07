"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { user } = useUser()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Unwrap params
    // Note: Next.js 15+ params are promises, but in 14 they are objects. 
    // Code looked like it was handling Promise before so I will use use call or await if needed.
    // Actually simpler to just React.use() if enabled or await in useEffect.
    // But standard client component usually receives params as prop.
    // Let's use React.use() pattern or just await inside effect if it's a promise.
    const [orderId, setOrderId] = useState<string | null>(null)

    useEffect(() => {
        // Handling async params
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
        file_url: "",
        file_name: "",
    })

    // Load initial data
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

                // Populate form
                setForm({
                    service_type: data.service_type || "",
                    quantity: data.quantity || 1,
                    notes: data.notes || "",
                    delivery_address: data.delivery_address || "",
                    due_date: data.due_date ? new Date(data.due_date).toISOString().split('T')[0] : "",
                    total_amount: Number(data.total_amount) || 0,
                    file_url: data.file_url || "",
                    file_name: data.file_name || "",
                })
            } catch (err) {
                console.error(err)
                setError("Could not load order details")
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [orderId])

    // Pricing Logic (Duplicated from OrderForm - should ideally be a shared util)
    useEffect(() => {
        const prices: Record<string, number> = {
            secretarial: 50,
            funeral: 100,
            magazine: 150,
            receipt: 80,
            poster: 40,
            exam: 20
        }
        const pricePerUnit = prices[form.service_type] || 0
        const total = pricePerUnit * form.quantity
        setForm(prev => {
            if (prev.total_amount !== total) {
                return { ...prev, total_amount: total }
            }
            return prev
        })
    }, [form.service_type, form.quantity])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            })

            if (!res.ok) throw new Error("Failed to update order")

            setSuccess(true)
            setTimeout(() => {
                router.push("/dashboard")
            }, 1500)
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
                <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
            </Button>

            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Edit Order #{orderId}</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
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

                    <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input id="quantity" name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} />
                    </div>

                    <div>
                        <Label htmlFor="total">Estimated Cost</Label>
                        <div className="text-xl font-bold text-primary">GH₵{form.total_amount.toFixed(2)}</div>
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
                            <Label htmlFor="due_date">Delivery Date</Label>
                            <Input id="due_date" name="due_date" type="date" value={form.due_date} onChange={handleChange} />
                        </div>
                    </div>

                    {/* File Upload Edit - Simplified for now, just show current file */}
                    <div>
                        <Label>Current File</Label>
                        {form.file_name ? (
                            <div className="text-sm bg-gray-100 p-2 rounded truncate">{form.file_name}</div>
                        ) : (
                            <div className="text-sm text-gray-500">No file attached</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">File replacement not yet supported in edit mode.</p>
                    </div>

                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    {success && <div className="text-green-600 font-bold">Order updated successfully! Redirecting...</div>}

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard">Cancel</Link>
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
