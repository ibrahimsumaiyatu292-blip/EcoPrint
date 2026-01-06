"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function OrderForm() {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service_type: "",
    quantity: 1,
    notes: "",
    delivery_address: "",
    due_date: "",
    total_amount: 0,
  })

  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const dropRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!file) {
      setFilePreview(null)
      return
    }
    setFilePreview(file.name)
  }, [file])

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }))
  }

  const handleFile = (f: File | null) => {
    setFile(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const readFileAsBase64 = (file: File) =>
    new Promise<{ name: string; data: string }>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        const base64 = result.split(",")[1]
        resolve({ name: file.name, data: base64 })
      }
      reader.onerror = (err) => reject(err)
      reader.readAsDataURL(file)
    })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")
    setErrorMessage(null)

    try {
      const payload: any = { ...form }

      if (file) {
        const { name, data } = await readFileAsBase64(file)
        payload.file_name = name
        payload.file_data = data
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let detail = ""
        try {
          const errBody = await res.json()
          detail = errBody?.error || JSON.stringify(errBody)
        } catch {
          detail = await res.text()
        }
        throw new Error(`${res.status} ${res.statusText}: ${detail}`)
      }

      setStatus("success")
      setForm({
        name: "",
        phone: "",
        email: "",
        service_type: "",
        quantity: 1,
        notes: "",
        delivery_address: "",
        due_date: "",
        total_amount: 0,
      })
      setFile(null)
      setTimeout(() => {
        setStatus("idle")
        closeModal()
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setErrorMessage(err?.message || "Failed to submit order")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Place an Order</h1>
        <p className="text-gray-600 mb-6">Fill out the form to submit an order. Click the button to open the full order modal.</p>

        <Button onClick={openModal}>Open Order Form</Button>
      </div>

      {/* Modal */}
      <div className={`${open ? "flex" : "hidden"} fixed inset-0 bg-black bg-opacity-50 items-center justify-center p-4 z-50`}>
        <div className="order-form max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Place Your Order</h3>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
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

              <div>
                <Label>Upload Design File</Label>
                <div
                  ref={dropRef}
                  id="dropArea"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="upload-area border border-dashed border-gray-300 p-6 rounded-lg text-center cursor-pointer"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <p className="text-gray-600 mb-2">Drag & drop your files here</p>
                  <p className="text-gray-500 text-sm">or click to browse</p>
                  <input id="fileInput" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.eps" onChange={handleFileChange} />
                  {filePreview && <p className="mt-3 text-sm text-gray-700">Selected: {filePreview}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} />
              </div>

              <div>
                <Label htmlFor="notes">Special Instructions</Label>
                <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} rows={4} />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Delivery Information</h4>
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
              </div>

              {status === "success" && <div className="text-sm text-green-700">Order submitted successfully. We will contact you shortly.</div>}
              {status === "error" && (
                <div className="text-sm text-red-700">
                  <div>Something went wrong. Please try again.</div>
                  {errorMessage && <div className="mt-1 text-xs text-red-600">Error: {errorMessage}</div>}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cancel
                </button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
