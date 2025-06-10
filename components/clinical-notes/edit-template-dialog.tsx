"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateClinicalNoteTemplate } from "@/lib/actions/clinical-notes-actions"
import type { ClinicalNoteCategory, ClinicalNoteTemplate } from "@/types"

const formSchema = z.object({
  categoryId: z.string().uuid("Please select a category."),
  name: z.string().min(1, "Template name is required."),
  content: z.string().min(1, "Template content is required."),
})

interface EditTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onTemplateUpdated: () => void
  template: ClinicalNoteTemplate
  categories: ClinicalNoteCategory[]
}

export function EditTemplateDialog({
  open,
  onOpenChange,
  onTemplateUpdated,
  template,
  categories,
}: EditTemplateDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: template.categoryId,
      name: template.name,
      content: template.content,
    },
  })

  useEffect(() => {
    form.reset({
      categoryId: template.categoryId,
      name: template.name,
      content: template.content,
    })
  }, [template, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await updateClinicalNoteTemplate(template.id, values)

      if (result.success) {
        toast({
          title: "Template Updated",
          description: "The clinical note template has been updated successfully.",
        })
        onTemplateUpdated()
        onOpenChange(false)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update template.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating template:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred while updating the template.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
          <DialogDescription>Update the details for this clinical note template.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Initial Assessment Template" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter template content here..." rows={8} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
