"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form"

const formSchema = z.object({
  staffId: z.string().min(1, "Staff ID is required"),
  staffName: z.string().min(1, "Staff name is required"),
  date: z.date({
    required_error: "Date is required",
  }),
  hoursWorked: z.coerce.number().positive("Hours must be positive"),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface CreateTimesheetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenantId: string
}

export function CreateTimesheetDialog({ 
  open, 
  onOpenChange,
  tenantId 
}: CreateTimesheetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      staffId: '',
      staffName: '',
      date: new Date(),
      hoursWorked: 8,
      notes: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/timesheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: format(data.date, 'yyyy-MM-dd'),
          tenantId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create timesheet');
      }

      // Reset form and close dialog
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating timesheet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Timesheet</DialogTitle>
          <DialogDescription>
            Enter the timesheet details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              \
