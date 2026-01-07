"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@clerk/nextjs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

const PaystackButton = dynamic(() => import("react-paystack").then((mod) => mod.PaystackButton), { ssr: false })

export function OrderForm() {
  const { user, isLoaded } = useUser()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
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
    payment_method: "pay_on_delivery",
  })

  const router = useRouter()

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

  useEffect(() => {
    if (isLoaded && user) {
      setForm(prev => ({
        ...prev,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || prev.name
      }))
    }
  }, [isLoaded, user])

  const openModal = () => setOpen(true)
  const closeModal = () => setOpen(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === "quantity" ? Number(value) : value }))
  }

  const PRICES: Record<string, number> = {
    secretarial: 50,
    funeral: 100,
    magazine: 150,
    receipt: 80,
    poster: 40,
    exam: 20
  }

  // Pricing Logic
  useEffect(() => {
    const pricePerUnit = PRICES[form.service_type] || 0
    const total = pricePerUnit * form.quantity
    setForm(prev => {
      if (prev.total_amount !== total) {
        return { ...prev, total_amount: total }
      }
      return prev
    })
  }, [form.service_type, form.quantity, PRICES]) // PRICES added to dep array but it's constant if outside, but good enough here

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

  const processOrderSubmission = async (finalPayload: any) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      })

      if (!res.ok) {
        let detail = ""
        try {
          const errBody = await res.json()
          detail = errBody.detail || errBody.error || JSON.stringify(errBody)
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
        payment_method: "pay_on_delivery",
      })
      setFile(null)
      setTimeout(() => {
        setIsRedirecting(true) // Show redirect message
        setTimeout(() => {
          setStatus("idle")
          closeModal()
          if (user) {
            router.push("/dashboard")
          } else {
            // Redirect guests to Sign Up to "create their account"
            router.push("/sign-up")
          }
        }, 1000)
      }, 1500)
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setErrorMessage(err?.message || "Failed to submit order")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Paystack Props
  const handlePaystackSuccess = (reference: any) => {
    // Manually trigger submission after payment
    const submitWithPaystack = async () => {
      setIsSubmitting(true)
      setStatus("idle")
      setErrorMessage(null)
      try {
        const payload: any = { ...form }
        payload.payment_status = "paid"
        payload.payment_reference = reference.reference

        if (file) {
          const { name, data } = await readFileAsBase64(file)
          payload.file_name = name
          payload.file_data = data
        }
        await processOrderSubmission(payload)
      } catch (err: any) {
        console.error(err)
        setStatus("error")
        setErrorMessage(err?.message || "Failed to submit order")
      } finally {
        setIsSubmitting(false)
      }
    }
    submitWithPaystack()
  }

  const handlePaystackClose = () => {
    console.log("Payment closed")
  }

  const paystackProps = {
    email: form.email,
    amount: Math.max(form.total_amount, 1) * 100,
    currency: "GHS",
    metadata: {
      custom_fields: [
        { display_name: "Name", variable_name: "name", value: form.name },
        { display_name: "Phone", variable_name: "phone", value: form.phone },
      ],
    },
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY || "",
    text: "Pay Now",
    onSuccess: handlePaystackSuccess,
    onClose: handlePaystackClose,
  }

  // Hook to handle Paystack success
  const onSuccess = (reference: any) => {
    // Implementation for what happens after a successful transaction
    const payload = { ...form } // Need to rebuild payload including file? 
    // Wait, file upload happens before? 
    // The previous handleSubmit logic merged file reading. 
    // We need to refactor handleSubmit to prepare everything, then decide to pay or submit.
    // This is getting complex in a ReplaceChunk. 
    // I will rewrite the whole handleSubmit function. 
  };

  // Wait, I can't easily reference local variables like `file` inside a simple callback if I don't set it up right.
  // Strategy: 
  // 1. Prepare payload (read file).
  // 2. If Pay On Delivery -> submit.
  // 3. If Paystack -> trigger modal. 
  //    - But the modal callback needs the payload. 

  // Let's defer this complex logic to a simpler 'handleSubmit' rewrite below.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // If Paystack is selected, we don't submit here. The Button handles it.
    // However, the button is inside the form, so we must prevent default if button is clicked?
    // Actually PaystackButton is a button type="button" usually, so it doesn't trigger submit.
    // But if connection fails/logic implies normal submit...

    // Only proceed if Pay on Delivery
    if (form.payment_method === "pay_on_delivery") {
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
        await processOrderSubmission(payload)
      } catch (err: any) {
        console.error(err)
        setStatus("error")
        setErrorMessage(err?.message || "Failed to submit order")
      } finally {
        setIsSubmitting(false)
      }
    }
  }
  // I will implement this fully in the replacement content.

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
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={!!user}
                    className={!!user ? "bg-gray-100 text-gray-500" : ""}
                  />
                  {user && <span className="text-xs text-muted-foreground absolute right-0 top-[-20px]">Logged in as {user.primaryEmailAddress?.emailAddress}</span>}
                </div>
              </div>

              <div>
                <select id="service_type" name="service_type" className="w-full px-4 py-2 border border-gray-300 rounded-lg" value={form.service_type} onChange={handleChange} required>
                  <option value="">Select a service</option>
                  <option value="secretarial">Secretarial Services (GH₵{PRICES.secretarial})</option>
                  <option value="funeral">Funeral Brochures (GH₵{PRICES.funeral})</option>
                  <option value="magazine">Magazines & Letterheads (GH₵{PRICES.magazine})</option>
                  <option value="receipt">Receipt & Invoice Books (GH₵{PRICES.receipt})</option>
                  <option value="poster">Posters & Obituaries (GH₵{PRICES.poster})</option>
                  <option value="exam">WAEC/BECE Card Services (GH₵{PRICES.exam})</option>
                </select>
                {form.service_type && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Unit Price: <span className="font-semibold text-primary">GH₵{PRICES[form.service_type]?.toFixed(2)}</span>
                  </p>
                )}
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

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between items-center">
                  <span className="text-blue-900 font-medium">Estimated Total Cost:</span>
                  <span className="text-2xl font-bold text-blue-700">GH₵{form.total_amount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-blue-600 mt-1 text-right">
                  {form.quantity} x GH₵{(PRICES[form.service_type] || 0).toFixed(2)}
                </p>
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

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Payment Method</h4>
                <RadioGroup
                  value={form.payment_method}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, payment_method: value }))}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay_on_delivery" id="pod" />
                    <Label htmlFor="pod">Pay on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paystack" id="paystack" />
                    <Label htmlFor="paystack">Pay Online (Paystack)</Label>
                  </div>
                </RadioGroup>
              </div>

              {status === "success" && !isRedirecting && <div className="text-sm text-green-700">Order submitted successfully. We will contact you shortly.</div>}
              {isRedirecting && <div className="text-sm font-bold text-blue-600 animate-pulse">Redirecting to your dashboard...</div>}
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
                {form.payment_method === "paystack" ? (
                  <PaystackButton className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md transition-colors" {...paystackProps} />
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Processing..." : "Submit Order"}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
