"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react"
import type { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Loader2 } from "lucide-react"
import { FormFieldComponent } from "@/components/forms/form-field"

interface FormFieldProps {
  name: string
  label: string
  type: "text" | "email" | "password" | "number" | "textarea" | "checkbox" | "radio" | "select" | "switch" | "date"
  placeholder?: string
  description?: string
  options?: { value: string; label: string }[]
  required?: boolean
}

interface CreateFormDialogProps {
  title: string
  description: string
  fields: FormFieldProps[]
  schema: z.ZodType<any, any>
  onSubmit: (data: any) => Promise<void>
  trigger: React.ReactNode
  submitButtonText?: string
  isSubmitting?: boolean
}

export function CreateFormDialog({
  title,
  description,
  fields,
  schema,
  onSubmit,
  trigger,
  submitButtonText = "Create",
  isSubmitting = false,
}: CreateFormDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc, field) => {
      if (field.type === "checkbox") {
        acc[field.name] = false
      } else if (field.type === "number") {
        acc[field.name] = 0
      } else {
        acc[field.name] = ""
      }
      return acc
    }, {} as any),
  })

  async function handleSubmit(values: z.infer<typeof schema>) {
    await onSubmit(values)
    form.reset()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {fields.map((field) => (
              <FormFieldComponent
                key={field.name}
                control={form.control}
                name={field.name}
                label={field.label}
                type={field.type}
                placeholder={field.placeholder}
                description={field.description}
                options={field.options}
                required={field.required}
              />
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {submitButtonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
