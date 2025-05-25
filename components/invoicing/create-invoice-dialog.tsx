"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { useErrorTracking } from "@/lib/error-tracking"
import { toast } from "@/components/ui/use-toast"

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface CreateInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  patients?: Array<{ id: string; first_name: string; last_name: string }>
}

export function CreateInvoiceDialog({ open, onOpenChange, onSuccess, patients = [] }: CreateInvoiceDialogProps) {
  const [patientId, setPatientId] = useState("")
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, rate: 0, amount: 0 }
  ])
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { trackError } = useErrorTracking()

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items]
    const item = newItems[index]
    
    if (field === "quantity" || field === "rate") {
      item[field] = Number(value) || 0
      item.amount = item.quantity * item.rate
    } else if (field === "description") {
      item[field] = value as string
    }
    
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!patientId) {
        throw new Error("Please select a patient")
      }

      if (!dueDate) {
        throw new Error("Please select a due date")
      }

      const validItems = items.filter(item => item.description && item.amount > 0)
      if (validItems.length === 0) {
        throw new Error("Please add at least one valid item")
      }

      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          invoice_date: format(invoiceDate, "yyyy-MM-dd"),
          due_date: format(dueDate, "yyyy-MM-dd"),
          items: validItems,
          notes,
          subtotal: calculateTotal(),
          tax_amount: 0, // You can add tax calculation logic here
          total_amount: calculateTotal(),
          status: "pending",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create invoice")
      }

      toast({
        title: "Success",
        description: "Invoice created successfully.",
      })

      // Reset form
      setPatientId("")
      setInvoiceDate(new Date())
      setDueDate(undefined)
      setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }])
      setNotes("")
      
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating invoice:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to create invoice"
      
      trackError(error as Error, {
        component: "CreateInvoiceDialog",
        action: "createInvoice",
        severity: "high",
        category: "database",
        metadata: {
          patientId,
          itemCount: items.length,
          totalAmount: calculateTotal(),
          hasNotes: !!notes,
        },
      })

      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(\
