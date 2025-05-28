"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CreateCarePlanTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateCarePlanTemplateDialog({ open, onOpenChange, onSuccess }: CreateCarePlanTemplateDialogProps) {
  const [template, setTemplate] = useState({
    name: "",
    description: "",
    category: "",
    condition: "",
    goals: [""],
    interventions: [""],
    assessments: [""],
    duration_days: 90,
    review_frequency_days: 30,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const addGoal = () => {
    setTemplate({ ...template, goals: [...template.goals, ""] })
  }

  const removeGoal = (index: number) => {
    setTemplate({
      ...template,
      goals: template.goals.filter((_, i) => i !== index),
    })
  }

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...template.goals]
    newGoals[index] = value
    setTemplate({ ...template, goals: newGoals })
  }

  const addIntervention = () => {
    setTemplate({ ...template, interventions: [...template.interventions, ""] })
  }

  const removeIntervention = (index: number) => {
    setTemplate({
      ...template,
      interventions: template.interventions.filter((_, i) => i !== index),
    })
  }

  const updateIntervention = (index: number, value: string) => {
    const newInterventions = [...template.interventions]
    newInterventions[index] = value
    setTemplate({ ...template, interventions: newInterventions })
  }

  const handleSubmit = async () => {
    if (!template.name || !template.category || !template.condition) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/care-plans/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...template,
          goals: template.goals.filter((g) => g.trim()),
          interventions: template.interventions.filter((i) => i.trim()),
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Care plan template created successfully",
        })
        onSuccess?.()
      } else {
        throw new Error("Failed to create template")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create care plan template",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Care Plan Template</DialogTitle>
          <DialogDescription>Create a reusable template for common care plans</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="e.g., Diabetes Management Plan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={template.category}
                onValueChange={(value) => setTemplate({ ...template, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chronic">Chronic Care</SelectItem>
                  <SelectItem value="acute">Acute Care</SelectItem>
                  <SelectItem value="preventive">Preventive Care</SelectItem>
                  <SelectItem value="mental-health">Mental Health</SelectItem>
                  <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition/Diagnosis *</Label>
            <Input
              id="condition"
              value={template.condition}
              onChange={(e) => setTemplate({ ...template, condition: e.target.value })}
              placeholder="e.g., Type 2 Diabetes"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={template.description}
              onChange={(e) => setTemplate({ ...template, description: e.target.value })}
              placeholder="Describe the care plan template..."
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                value={template.duration_days}
                onChange={(e) => setTemplate({ ...template, duration_days: Number.parseInt(e.target.value) || 90 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Review Frequency (days)</Label>
              <Input
                id="review"
                type="number"
                value={template.review_frequency_days}
                onChange={(e) =>
                  setTemplate({ ...template, review_frequency_days: Number.parseInt(e.target.value) || 30 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Goals</Label>
              <Button type="button" size="sm" variant="outline" onClick={addGoal}>
                <Plus className="h-4 w-4 mr-1" />
                Add Goal
              </Button>
            </div>
            <div className="space-y-2">
              {template.goals.map((goal, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    placeholder={`Goal ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => removeGoal(index)}
                    disabled={template.goals.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Interventions</Label>
              <Button type="button" size="sm" variant="outline" onClick={addIntervention}>
                <Plus className="h-4 w-4 mr-1" />
                Add Intervention
              </Button>
            </div>
            <div className="space-y-2">
              {template.interventions.map((intervention, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={intervention}
                    onChange={(e) => updateIntervention(index, e.target.value)}
                    placeholder={`Intervention ${index + 1}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => removeIntervention(index)}
                    disabled={template.interventions.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
