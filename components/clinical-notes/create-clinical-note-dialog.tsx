"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import {
  createClinicalNote,
  type ClinicalNoteCategory,
  type ClinicalNoteTemplate,
} from "@/lib/services/clinical-notes-service"

interface CreateClinicalNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNoteCreated: (note: any) => void
  categories: ClinicalNoteCategory[]
  templates: ClinicalNoteTemplate[]
  patientId?: string | null
}

export default function CreateClinicalNoteDialog({
  open,
  onOpenChange,
  onNoteCreated,
  categories,
  templates,
  patientId,
}: CreateClinicalNoteDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: patientId || "",
    category_id: "",
    title: "",
    content: "",
    is_private: false,
    is_important: false,
  })
  const [selectedTemplate, setSelectedTemplate] = useState("")

  useEffect(() => {
    if (selectedTemplate) {
      const template = templates.find((t) => t.id === selectedTemplate)
      if (template) {
        setFormData((prev) => ({
          ...prev,
          content: template.content,
          category_id: template.category_id || prev.category_id,
        }))
      }
    }
  }, [selectedTemplate, templates])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.patient_id) {
        throw new Error("Patient ID is required")
      }

      const newNote = await createClinicalNote(formData)
      toast({
        title: "Note created",
        description: "The clinical note has been created successfully.",
      })
      onNoteCreated(newNote)
    } catch (error: any) {
      console.error("Error creating note:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create the clinical note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Clinical Note</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleSelectChange("category_id", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

            <div className="space-y-2">
              <Label htmlFor="template">Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="min-h-[200px]"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_private"
                checked={formData.is_private}
                onCheckedChange={(checked) => handleCheckboxChange("is_private", !!checked)}
              />
              <Label htmlFor="is_private">Private</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_important"
                checked={formData.is_important}
                onCheckedChange={(checked) => handleCheckboxChange("is_important", !!checked)}
              />
              <Label htmlFor="is_important">Important</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Note"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
