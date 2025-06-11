"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClinicalNote } from "@/lib/actions/clinical-notes-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ClinicalNoteCategory } from "@/types"

export function CreateClinicalNoteDialog({
  // Changed to named export
  open,
  onOpenChange,
  onNoteCreated,
  patientId,
  categories,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteCreated: () => void
  patientId?: string
  categories: ClinicalNoteCategory[]
}) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (!patientId) {
        toast({
          title: "Error",
          description: "Patient ID is required to create a clinical note.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const result = await createClinicalNote({
        patient_id: patientId,
        title,
        content,
        category_id: categoryId,
      })

      if (result.success) {
        toast({
          title: "Success",
          description: "Clinical note created successfully.",
        })
        onNoteCreated()
        onOpenChange(false)
        setTitle("")
        setContent("")
        setCategoryId(undefined)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to create clinical note.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating clinical note:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
          <DialogDescription>Fill in the details for the new clinical note.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="content" className="text-right">
                Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="col-span-3 min-h-[150px]"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select onValueChange={setCategoryId} value={categoryId} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
