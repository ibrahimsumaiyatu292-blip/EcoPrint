"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Edit, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Customer {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  order_count: number
  total_spent: string
  created_at: string
}

export function CustomersTable({ customers: initialCustomers }: { customers: Customer[] }) {
  const router = useRouter()
  const [customers, setCustomers] = useState(initialCustomers)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCustomers = customers.filter((customer) => {
    const search = searchTerm.toLowerCase()
    return (
      customer.name.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search) ||
      (customer.company && customer.company.toLowerCase().includes(search))
    )
  })

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer? This will also delete all their orders.")) return

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setCustomers(customers.filter((customer) => customer.id !== id))
        router.refresh()
      }
    } catch (error) {
      console.error("Error deleting customer:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Member Since</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone || "N/A"}</TableCell>
                  <TableCell>{customer.company || "N/A"}</TableCell>
                  <TableCell>{customer.order_count}</TableCell>
                  <TableCell className="font-medium">GH₵{Number(customer.total_spent || 0).toFixed(2)}</TableCell>
                  <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/customers/${customer.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
