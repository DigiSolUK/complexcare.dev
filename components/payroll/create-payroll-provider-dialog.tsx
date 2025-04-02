"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Provider name must be at least 2 characters.",
  }),
  type: z.string().min(1, {
    message: "Please select a provider type.",
  }),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
})

type PayrollProvider = {
  id: string
  name: string
  type: string
  status: string
  [key: string]: any
}

interface CreatePayrollProviderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (provider: PayrollProvider) => void
}

export function CreatePayrollProviderDialog({ open, onOpenChange, onSuccess }: CreatePayrollProviderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, we would call an API here
      console.log("Submitting form with values:", values)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newProvider: PayrollProvider = {
        id: Math.random().toString(36).substring(2, 11),
        name: values.name,
        type: values.type,
        status: "active",
        apiKey: values.apiKey,
        apiSecret: values.apiSecret,
        createdAt: new Date().toISOString(),
      }

      onSuccess?.(newProvider)
      form.reset()
    } catch (error) {
      console.error("Failed to create provider:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Payroll Provider</DialogTitle>
          <DialogDescription>Configure a new payroll provider to integrate with your system.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter provider name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sage">Sage</SelectItem>
                      <SelectItem value="xero">Xero</SelectItem>
                      <SelectItem value="quickbooks">QuickBooks</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter API key" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret (Optional)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter API secret" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Creating..." : "Create Provider"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

