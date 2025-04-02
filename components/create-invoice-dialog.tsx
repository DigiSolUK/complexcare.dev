"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Patient } from "@/types"

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [invoiceNumber, setInvoiceNumber] = useState("")

  const [formData, setFormData] = useState({
    patientId: "",
    description: "",
    amount: "",
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: "draft",
    items: [{ description: "", quantity: "1", unitPrice: "", taxRate: "0", total: "0" }],
  })

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/patients")
        if (!response.ok) {
          throw new Error("Failed to fetch patients")
        }
        const data = await response.json()
        setPatients(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const fetchNextInvoiceNumber = async () => {
      try {
        const response = await fetch("/api/invoices/next-number")
        if (response.ok) {
          const data = await response.json()
          setInvoiceNumber(data.invoiceNumber)
        }
      } catch (err) {
        console.error(err)
        setInvoiceNumber("INV-" + new Date().getTime().toString().slice(-6))
      }
    }

    if (open) {
      fetchPatients()
      fetchNextInvoiceNumber()
    }
  }, [open])

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Recalculate total
    if (field === "quantity" || field === "unitPrice" || field === "taxRate") {
      const quantity = Number.parseFloat(newItems[index].quantity) || 0
      const unitPrice = Number.parseFloat(newItems[index].unitPrice) || 0
      const taxRate = Number.parseFloat(newItems[index].taxRate) || 0

      const subtotal = quantity * unitPrice
      const tax = subtotal * (taxRate / 100)
      const total = subtotal + tax

      newItems[index].total = total.toFixed(2)
    }

    setFormData({ ...formData, items: newItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: "1", unitPrice: "", taxRate: "0", total: "0" }],
    })
  }

  const removeItem = (index: number) => {
    const newItems = [...formData.items]
    newItems.splice(index, 1)
    setFormData({ ...formData, items: newItems })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + Number.parseFloat(item.total || "0"), 0).toFixed(2)
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      // Calculate total amount
      const totalAmount = calculateTotal()

      // Prepare invoice items
      const items = formData.items.map((item) => ({
        description: item.description,
        quantity: Number.parseFloat(item.quantity),
        unit_price: Number.parseFloat(item.unitPrice),
        tax_rate: Number.parseFloat(item.taxRate),
        tax_amount:
          (Number.parseFloat(item.quantity) * Number.parseFloat(item.unitPrice) * Number.parseFloat(item.taxRate)) /
          100,
        discount_amount: 0,
        total_amount: Number.parseFloat(item.total),
      }))

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: formData.patientId,
          amount: totalAmount,
          dueDate: format(formData.dueDate, "yyyy-MM-dd"),
          invoiceNumber,
          description: formData.description,
          status: formData.status,
          items,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create invoice")
      }

      const data = await response.json()
      onOpenChange(false)
      router.push(`/invoicing/${data.id}`)
      router.refresh()
    } catch (err) {
      console.error(err)
      alert("Failed to create invoice. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Invoice</DialogTitle>
          <DialogDescription>Create a new invoice for a patient. Fill in the details below.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-0001"
              />
            </div>

            <div>
              <Label htmlFor="patient">Patient</Label>
              <Select
                value={formData.patientId}
                onValueChange={(value) => setFormData({ ...formData, patientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <SelectItem value="loading" disabled>
                      Loading patients...
                    </SelectItem>
                  ) : patients.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No patients found
                    </SelectItem>
                  ) : (
                    patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Invoice description"
            />
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.dueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dueDate}
                  onSelect={(date) => date && setFormData({ ...formData, dueDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Invoice Items</Label>
            <div className="space-y-2 mt-2">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <Input
                      placeholder="Item description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      type="number"
                      min="1"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="col-span-1">
                    <Input
                      placeholder="Tax %"
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, "taxRate", e.target.value)}
                      type="number"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input placeholder="Total" value={item.total} readOnly />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Amount</div>
              <div className="text-2xl font-bold">£{calculateTotal()}</div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Creating..." : "Create Invoice"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

